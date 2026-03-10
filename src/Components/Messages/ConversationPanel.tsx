import { Alert, Button, Spinner } from "react-bootstrap";
import {
  useClearConversationMutation,
  useGetConversationDetailQuery,
  useGetConversationMessagesQuery,
  useMarkMessageAsReadMutation,
} from "../../api/messageApi";
import { useAppSelector } from "../../store/hooks";
import MessageBubble from "./MessageBubble";
import MessageComposer from "./MessageComposer";
import { useEffect, useMemo } from "react";
import type { MessageResponseDTO } from "../../types/message";

const ConversationPanel = () => {
  const selectedConversationId = useAppSelector(
    (s) => s.message.selectedConversationId
  );

  const currentUser = useAppSelector((s) => s.auth.user);

  const {
    data: detail,
    isLoading: isLoadingDetail,
    isError: isDetailError,
  } = useGetConversationDetailQuery(selectedConversationId!, {
    skip: !selectedConversationId,
  });

  const {
    data: messages,
    isLoading: isLoadingMessages,
    isError: isMessagesError,
  } = useGetConversationMessagesQuery(
    { conversationId: selectedConversationId!, page: 0, size: 50 },
    { skip: !selectedConversationId, pollingInterval: 5000 }
  );

  const [clearConversation, { isLoading: isClearing }] = useClearConversationMutation();
  const [markMessageAsRead] = useMarkMessageAsReadMutation();

  useEffect(() => {
    if (!selectedConversationId || !messages || !currentUser) return;

    const unreadMessages = messages.filter(
      (m) => m.senderId !== currentUser.id && !m.readAt
    );

    unreadMessages.forEach((m) => {
      markMessageAsRead({
        messageId: m.id,
        conversationId: selectedConversationId,
      });
    });
  }, [messages, currentUser, selectedConversationId, markMessageAsRead]);

  const messagesById = useMemo(() => {
    const map = new Map<string, MessageResponseDTO>();
    (messages ?? []).forEach((m) => map.set(m.id, m));
    return map;
  }, [messages]);

  if (!selectedConversationId) {
    return (
      <div className="h-100 d-flex align-items-center justify-content-center text-muted">
        Select a conversation
      </div>
    );
  }

  if (isLoadingDetail || isLoadingMessages) {
    return (
      <div className="h-100 d-flex align-items-center justify-content-center">
        <Spinner animation="border" />
      </div>
    );
  }

  if (isDetailError || isMessagesError) {
    return (
      <div className="p-3">
        <Alert variant="danger">Error loading conversation.</Alert>
      </div>
    );
  }

  const otherParticipants =
    detail?.partecipants?.filter((p) => p.id !== currentUser?.id) ?? [];

  return (
    <div className="h-100 d-flex flex-column">
      <div className="border-bottom p-3 d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0">
            {otherParticipants.map((p) => `${p.surname} ${p.name}`).join(", ")}
          </h5>
        </div>

        <Button
          size="sm"
          variant="outline-danger"
          onClick={() => clearConversation({ conversationId: selectedConversationId })}
          disabled={isClearing}
        >
          {isClearing ? "Deleting..." : "Delete chat"}
        </Button>
      </div>

      <div className="flex-grow-1 overflow-auto p-3">
        {(messages ?? []).length === 0 ? (
          <div className="text-muted">No messages yet.</div>
        ) : (
          (messages ?? []).map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              conversationId={selectedConversationId}
              repliedMessage={
                m.replyToMessageId ? messagesById.get(m.replyToMessageId) ?? null : null
              }
            />
          ))
        )}
      </div>

      <MessageComposer conversationId={selectedConversationId} />
    </div>
  );
};

export default ConversationPanel;