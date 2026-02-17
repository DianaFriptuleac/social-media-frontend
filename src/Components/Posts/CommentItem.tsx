import { useMemo, useState } from "react";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from "../../api/postApi";
import { useAppSelector } from "../../store/hooks";
import type { CommentResponseDTO } from "../../types/postShare";
import {
  Card,
  Spinner,
  Stack,
  Form,
  Button,
  Badge,
  Collapse,
} from "react-bootstrap";
import "../../css/Posts.css";

type Props = {
  postId: string;
  postAuthorId: string;
  comment: CommentResponseDTO;
};

const CommentItem = ({ postId, postAuthorId, comment }: Props) => {
  const me = useAppSelector((s) => s.auth.user);

  const [createComment, { isLoading: replying }] = useCreateCommentMutation();
  const [deleteComment, { isLoading: deleting }] = useDeleteCommentMutation();

  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const canDelete = useMemo(() => {
    if (!me) return false;
    const isOwner = me.id === comment.author.id;
    const isPostOwner = me.id === postAuthorId;
    const isAdmin = (me as any).role === "ADMIN";
    return isOwner || isPostOwner || isAdmin;
  }, [me, comment.author.id, postAuthorId]);

  const onDelete = async () => {
    try {
      await deleteComment({ commentId: comment.id, postId }).unwrap();
    } catch (e) {
      console.error(e);
      alert("You are not allowed to delete this comment.");
    }
  };

  const onReply = async () => {
    const text = replyText.trim();
    if (!text) return;
    try {
      await createComment({
        postId,
        body: { text, parentCommentId: comment.id },
      }).unwrap();
      setReplyText("");
      setShowReply(false);
    } catch (e) {
      console.error(e);
      alert("Failed to reply.");
    }
  };

  return (
    <Card className="post-card mt-2">
      <Card.Body className="p-2">
        <Stack
          direction="horizontal"
          className="justify-content-between"
          gap={2}
        >
          {/* Stack equivalente a -> <div className="d-flex justify-content-between align-items-center gap-2" */}
          <div className="w-100">
            <Stack
              direction="horizontal"
              gap={2}
              className="align-items-center"
            >
              <div className="fw-semibold">
                {comment.author.name} {comment.author.surname}
              </div>

              {me?.id === comment.author.id && (
                <Badge bg="secondary" pill>
                  You
                </Badge>
              )}
            </Stack>

            <Card.Text className="post-text mb-0">{comment.text}</Card.Text>

            <Stack direction="horizontal" gap={2} className="mt-2 flex-wrap">
              {me && (
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => setShowReply((v) => !v)}
                >
                  Reply
                </Button>
              )}

              {canDelete && (
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={onDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </Button>
              )}
            </Stack>

            <Collapse in={showReply}>
              <div className="comment-replybox mt-2">
                <Form.Group className="mb-2">
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="comment-replybox-textarea"
                  />
                </Form.Group>

                <Stack
                  direction="horizontal"
                  gap={2}
                  className="comment-replybox-actions"
                >
                  <Button size="sm" onClick={onReply} disabled={replying}>
                    {replying ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Sending...
                      </>
                    ) : (
                      "Send"
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowReply(false)}
                  >
                    Cancel
                  </Button>
                </Stack>
              </div>
            </Collapse>
          </div>

          <div className="post-meta text-nowrap">
            {new Date(comment.createdAt).toLocaleString()}
          </div>
        </Stack>

        {comment.replies?.length ? (
          <div className="mt-2">
            {comment.replies.map((r) => (
              <CommentItem
                key={r.id}
                postId={postId}
                postAuthorId={postAuthorId}
                comment={r}
              />
            ))}
          </div>
        ) : null}
      </Card.Body>
    </Card>
  );
};
export default CommentItem;
