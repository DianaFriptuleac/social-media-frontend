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
import "../../css/Messages.css"

const ConversationPanel = () => {
  //conversazione selezionata dallo store Redux
  const selectedConversationId = useAppSelector(
    (s) => s.message.selectedConversationId,
  );

  const currentUser = useAppSelector((s) => s.auth.user);

  // dettagli conversazione
  const {
    currentData: detail,
    isLoading: isLoadingDetail,
    isFetching: isFetchingDetail,
    isError: isDetailError,
  } = useGetConversationDetailQuery(selectedConversationId!, {
    skip: !selectedConversationId,
  });

  // Messaggi conversazione
  const {
    currentData: messages,
    isLoading: isLoadingMessages,
    isFetching: isFetchingMessages,
    isError: isMessagesError,
  } = useGetConversationMessagesQuery(
    { conversationId: selectedConversationId!, page: 0, size: 50 },
    { skip: !selectedConversationId }, // pollingInterval: 5000 - ricarica automaticamente ogni 5 secondi
  );

  // cancellare tutta la conversazione
  const [clearConversation, { isLoading: isClearing }] =
    useClearConversationMutation();
  const [markMessageAsRead] = useMarkMessageAsReadMutation();

  // Ogni volta che arrivano nuovi messaggi controlla se ci sono messaggi non letti
  useEffect(() => {
    if (!selectedConversationId || !messages || !currentUser) return;

    const unreadMessages = messages.filter(
      (m) => m.senderId !== currentUser.id && !m.readAt, // msg non inviati da me e ancora non letti
    );

    unreadMessages.forEach((m) => {
      markMessageAsRead({
        messageId: m.id,
        conversationId: selectedConversationId,
      });
    });
  }, [messages, currentUser, selectedConversationId, markMessageAsRead]);

  // Crea una mappa dei messaggi per id (per trovare velocemente il messaggio a cui si risponde)
  const messagesById = useMemo(() => {
    const map = new Map<string, MessageResponseDTO>();
    // Inserisce ogni messaggio nel map
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

  if (
    isLoadingDetail ||
    isLoadingMessages ||
    isFetchingDetail ||
    isFetchingMessages
  ) {
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
  // Filtra partecipanti escludendo l'utente corrente
  const otherParticipants =
    detail?.partecipants?.filter((p) => p.id !== currentUser?.id) ?? [];

  return (
    <div className="messages-panel h-100 d-flex flex-column">
      <div className="messages-chat-header p-3 d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0 messages-chat-name">
            {otherParticipants.map((p) => `${p.surname} ${p.name}`).join(", ")}
          </h5>
        </div>

        <Button
          size="sm"
          variant="outline-danger"
          onClick={() =>
            clearConversation({ conversationId: selectedConversationId })
          }
          disabled={isClearing}
        >
          {isClearing ? "Deleting..." : "Delete chat"}
        </Button>
      </div>

      <div className="messages-scroll flex-grow-1 overflow-auto p-3">
        {(messages ?? []).length === 0 ? (
          <div className="text-muted">No messages yet.</div>
        ) : (
          (messages ?? []).map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              conversationId={selectedConversationId}
              repliedMessage={
                m.replyToMessageId
                  ? (messagesById.get(m.replyToMessageId) ?? null)
                  : null
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
