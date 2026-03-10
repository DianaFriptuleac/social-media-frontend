import { Button, Card } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setReplyToMessage } from "../../store/messageSlice";
import { useDeleteMessageForMeMutation } from "../../api/messageApi";
import type { MessageResponseDTO } from "../../types/message";

interface MessageBubbleProps {
  message: MessageResponseDTO;
  conversationId: string;
  repliedMessage?: MessageResponseDTO | null;
}

const MessageBubble = ({ message, conversationId, repliedMessage }: MessageBubbleProps) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.auth.user);

  const isMine = currentUser?.id === message.senderId;
  const [deleteMessageForMe, { isLoading: isDeleting }] = useDeleteMessageForMeMutation();

  const handleDelete = async () => {
    try {
      await deleteMessageForMe({
        messageId: message.id,
        conversationId,
      }).unwrap();
    } catch {
    }
  };

  return (
    <div className={`d-flex mb-3 ${isMine ? "justify-content-end" : "justify-content-start"}`}>
      <Card style={{ maxWidth: "70%" }}>
        <Card.Body>
          {repliedMessage && (
            <div className="border-start ps-2 mb-2 text-muted small">
              <div><strong>Reply to:</strong></div>
              <div>{repliedMessage.text || "[Attachment]"}</div>
            </div>
          )}

          <div>{message.text}</div>

          <div className="mt-2 d-flex gap-2 justify-content-end">
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

          <div className="small text-muted mt-2">
            {new Date(message.createdAt).toLocaleString()}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default MessageBubble;