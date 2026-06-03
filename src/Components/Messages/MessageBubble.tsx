import { Button, Card, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setReplyToMessage } from "../../store/messageSlice";
import { useDeleteMessageForMeMutation } from "../../api/messageApi";
import type { MessageResponseDTO } from "../../types/message";
import { FiCornerUpLeft, FiTrash2 } from "react-icons/fi";
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    )
    if (!confirmed) return;
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
              className="message-action-icon message-action-icon--reply"
              onClick={() => dispatch(setReplyToMessage(message))}
            >
              <FiCornerUpLeft />
            </Button>

            <Button
              className="message-action-icon message-action-icon--delete"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Spinner size="sm" /> : <FiTrash2 />}
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
