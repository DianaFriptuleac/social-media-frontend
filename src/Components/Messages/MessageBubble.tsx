import { Button, Card } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setReplyToMessage } from "../../store/messageSlice";
import { useDeleteMessageForMeMutation } from "../../api/messageApi";
import type { MessageResponseDTO } from "../../types/message";
import "../../css/Messages.css";

interface MessageBubbleProps {
  message: MessageResponseDTO;
  conversationId: string;
  // Se il messaggio è una risposta, contiene il messaggio originale
  repliedMessage?: MessageResponseDTO | null;
}
//Singolo messaggio nella chat
const MessageBubble = ({
  message,
  conversationId,
  repliedMessage,
}: MessageBubbleProps) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((u) => u.auth.user);

  const isMine = currentUser?.id === message.senderId;
  const [deleteMessageForMe, { isLoading: isDeleting }] =
    useDeleteMessageForMeMutation();

  const handleDelete = async () => {
    try {
      await deleteMessageForMe({
        messageId: message.id,
        conversationId,
      }).unwrap();
    } catch {}
  };

  return (
    <div className={`message-row ${isMine ? "mine" : "other"}`}>
      <Card className={`message-bubble ${isMine ? "mine" : "other"}`}>
        <Card.Body>
          {repliedMessage && (
            <div className="message-reply-preview">
              <div className="message-text">
                <div>
                  <strong>Reply to:</strong>
                </div>
                <div>{repliedMessage.text || "[Attachment]"}</div>
              </div>
            </div>
          )}

          <div className="message-text">{message.text}</div>

          <div className="message-actions">
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() => dispatch(setReplyToMessage(message))}
            >
              Reply
            </Button>

            <Button
              size="sm"
              variant="outline-danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </div>

          <div className="message-time">
            {new Date(message.createdAt).toLocaleString()}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default MessageBubble;
