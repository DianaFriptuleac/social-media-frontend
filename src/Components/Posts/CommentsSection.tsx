import { useMemo, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import {
  useCreateCommentMutation,
  useGetCommentsQuery,
} from "../../api/postApi";
import {
  Badge,
  Button,
  Card,
  Spinner,
  Stack,
  Form,
  Alert,
} from "react-bootstrap";
import CommentItem from "./CommentItem";
import "../../css/Posts.css"

type Props = {
  postId: string;
  postAuthorId: string;
};

const CommentsSection = ({ postId, postAuthorId }: Props) => {
  const me = useAppSelector((s) => s.auth.user);

  const [text, setText] = useState("");

  const { data, isLoading, error, refetch, isFetching } = useGetCommentsQuery({
    postId,
  });

  const [createComment, { isLoading: creating }] = useCreateCommentMutation();

  const rootComments = useMemo(() => data ?? [], [data]);

  const onCreate = async () => {
    const t = text.trim();
    if (!t) return;
    try {
      await createComment({ postId, body: { text: t } }).unwrap();
      setText("");
    } catch (e) {
      console.error(e);
      alert("Failed to create comment.");
    }
  };

  return (
    <Card className="post-card mt-3">
      <Card.Body>
        <Stack
          direction="horizontal"
          className="justify-content-between mb-2"
          gap={2}
        >
          <div className="fw-semibold">
            Comments{" "}
            <Badge bg="secondary" pill>
              {rootComments.length}
            </Badge>
          </div>

          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inbox-refresh"
          >
            {isFetching ? (
              <>
                <Spinner size="sm" className="me-2" />
                Refreshing...
              </>
            ) : (
              "Refresh"
            )}
          </Button>
        </Stack>

        {me ? (
          <Card className="post-card mb-3">
            <Card.Body className="py-2">
              <Form.Group className="mb-2">
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write a comment..."
                  className="createpost-textarea"
                />
              </Form.Group>

              <Stack direction="horizontal" gap={2}>
                <Button
                  size="sm"
                  onClick={onCreate}
                  disabled={creating || text.trim().length === 0}
                  className="createpost-action-btn"
                >
                  {creating ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Publishing...
                    </>
                  ) : (
                    "Publish"
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => setText("")}
                  disabled={creating || text.length === 0}
                >
                  Clear
                </Button>
              </Stack>
            </Card.Body>
          </Card>
        ) : (
          <Alert variant="secondary">Login to write a comment.</Alert>
        )}

        {isLoading ? (
          <Spinner />
        ) : error ? (
          <Alert variant="danger">Failed to load comments</Alert>
        ) : rootComments.length === 0 ? (
          <div className="inbox-empty">No comments yet.</div>
        ) : (
          <div>
            {rootComments.map((c) => (
              <CommentItem
                key={c.id}
                postId={postId}
                postAuthorId={postAuthorId}
                comment={c}
              />
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
export default CommentsSection;
