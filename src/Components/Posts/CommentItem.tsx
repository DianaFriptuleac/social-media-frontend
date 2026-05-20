import { useMemo, useState } from "react";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from "../../api/postApi";
import { useAppSelector } from "../../store/hooks";
import type { CommentResponseDTO } from "../../types/postShare";
import { Spinner, Form, Button, Collapse } from "react-bootstrap";
import { FiTrash2, FiMoreHorizontal } from "react-icons/fi";
import { Dropdown } from "react-bootstrap";
import "../../css/Posts.css";

type Props = {
  postId: string;
  postAuthorId: string;
  comment: CommentResponseDTO;
};

const CommentItem = ({ postId, postAuthorId, comment}: Props) => {
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
  const [showReplies, setShowReplies] = useState(false);
  const repliesCount = comment.replies?.length ?? 0;

  return (
    <div className="comment-item">
      <div className="comment-main">
        <div className="comment-avatar">{comment.author.name?.[0]}</div>
        <div className="comment-content">
          <div className="comment-bubble">
            <div className="comment-header">
              <div>
                <span className="comment-author">
                  {comment.author.name} {comment.author.surname}{" "}
                </span>
                {me?.id === comment.author.id && (
                  <span className="comment-badge">You</span>
                )}
              </div>

              <Dropdown align="end" className="comment-menu">
                <Dropdown.Toggle className="comment-dots">
                  <FiMoreHorizontal />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {canDelete && (
                    <Dropdown.Item
                      onClick={onDelete}
                      disabled={deleting}
                      className="comment-delete-item"
                    >
                      <FiTrash2 className="me-2" />
                      {deleting ? "Deleting..." : "Delete"}
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="comment-text">{comment.text}</div>
          </div>
          <div className="comment-actions">
            <span>{new Date(comment.createdAt).toLocaleString()}</span>

            {me && (
              <Button onClick={() => setShowReply((v) => !v)}>Reply</Button>
            )}
            {repliesCount > 0 && (
              <Button onClick={() => setShowReplies((v) => !v)}>
                {showReplies ? "Hide replies" : `View ${repliesCount} replies`}
              </Button>
            )}
          </div>

          <Collapse in={showReply}>
            <div className="comment-replybox">
              <Form.Control
                as="textarea"
                rows={2}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="comment-replybox-textarea"
              />

              <div className="comment-replybox-actions">
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
              </div>
            </div>
          </Collapse>
          {repliesCount > 0 && showReplies && (
            <div
              className="comment-replies"
            >
              {comment.replies.map((r) => (
                <CommentItem
                  key={r.id}
                  postId={postId}
                  postAuthorId={postAuthorId}
                  comment={r}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CommentItem;
