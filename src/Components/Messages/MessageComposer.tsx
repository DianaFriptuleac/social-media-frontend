import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useSendMessageMutation } from "../../api/messageApi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setReplyToMessage } from "../../store/messageSlice";

interface MessageComposerProps {
  conversationId: string;
}

const MessageComposer = ({ conversationId }: MessageComposerProps) => {
  const dispatch = useAppDispatch();
  const replyToMessage = useAppSelector((s) => s.message.replyToMessage);

  const [text, setText] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!text.trim()) {
      setErrorMsg("Write a message.");
      return;
    }

    try {
      await sendMessage({
        conversationId,
        text: text.trim(),
        replyToMessageId: replyToMessage?.id ?? null,
      }).unwrap();

      setText("");
      dispatch(setReplyToMessage(null));
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Error sending message.");
    }
  };

  return (
    <div className="border-top p-3">
      {replyToMessage && (
        <Alert variant="secondary" className="py-2 d-flex justify-content-between align-items-center">
          <div>
            <strong>Replying to:</strong> {replyToMessage.text || "[Attachment]"}
          </div>
          <Button
            size="sm"
            variant="outline-dark"
            onClick={() => dispatch(setReplyToMessage(null))}
          >
            Cancel
          </Button>
        </Alert>
      )}

      {errorMsg && <Alert variant="warning">{errorMsg}</Alert>}

      <Form onSubmit={handleSend}>
        <div className="d-flex gap-2">
          <Form.Control
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message..."
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default MessageComposer;