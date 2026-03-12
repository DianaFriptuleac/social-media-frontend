import { Alert, Badge, Button, ListGroup, Spinner } from "react-bootstrap";
import { useGetMyConversationsQuery } from "../../api/messageApi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  openNewConversationModal,
  setSelectedConversation,
} from "../../store/messageSlice";
import "../../css/Messages.css"

const ConversationList = () => {
  const dispatch = useAppDispatch();
  const selectedConversationId = useAppSelector(
    (s) => s.message.selectedConversationId,
  );

  const { data, isLoading, isError } = useGetMyConversationsQuery();

  if (isLoading) {
    return (
      <div className="p-3 text-center">
        <Spinner animation="border" />
      </div>
    );
  }

  if (isError) {
    return <Alert variant="danger">Error loading conversations.</Alert>;
  }

  const conversations = data ?? [];

  return (
    <div className="messages-sidebar h-100 d-flex flex-column">
      <div className="messages-sidebar-header p-3 d-flex justify-content-between align-items-center">
        <h5 className="messages-title mb-0">Messages</h5>
        <Button
          className="messages-new-btn"
          size="sm"
          onClick={() => dispatch(openNewConversationModal())}
        >
          New
        </Button>
      </div>

      <div className="flex-grow-1 overflow-auto">
        <ListGroup variant="flush">
          {conversations.length === 0 && (
            <ListGroup.Item className="text-muted">
              No conversations yet.
            </ListGroup.Item>
          )}

          {conversations.map((c) => {
            const active = selectedConversationId === c.id;
            const fullName = c.otherUser
              ? `${c.otherUser.surname} ${c.otherUser.name}`
              : "Unknown user";

            return (
              <ListGroup.Item
                className="messages-list-item"
                key={c.id}
                action
                active={active}
                onClick={() => dispatch(setSelectedConversation(c.id))}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="me-2">
                    <div className="messages-user-name">{fullName}</div>
                    <div
                      className="messages-last-text small text-truncate"
                      style={{ maxWidth: 220 }}
                    >
                      {c.lastMessageText ?? "No messages yet"}
                    </div>
                  </div>

                  {c.unreadCount > 0 && selectedConversationId !== c.id && (
                    <Badge className="messages-badge">{c.unreadCount}</Badge>
                  )}
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </div>
    </div>
  );
};

export default ConversationList;
