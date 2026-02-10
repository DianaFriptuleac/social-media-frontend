import { useState } from "react";
import {
  useDeletePostMutation,
  useUpdatePostWithMediaMutation,
} from "../../api/postApi";
import type { PostResponseDTO } from "../../types/post";
import { Card, Form, ListGroup, Button, Spinner } from "react-bootstrap";

const PostCard = ({
  post,
  canEdit,
}: {
  post: PostResponseDTO;
  canEdit: boolean;
}) => {
  const [deletePost, { isLoading: deleting }] = useDeletePostMutation();
  const [updatePost, { isLoading: updating }] =
    useUpdatePostWithMediaMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(post.title ?? "");
  const [description, setDescription] = useState(post.description ?? "");
  const [filesToAdd, setFilesToAdd] = useState<File[]>([]);
  const [mediaToRemove, setMediaToRemove] = useState<string[]>([]);

  const onSave = async () => {
    await updatePost({
      postId: post.id,
      post: { title, description },
      mediaToRemove,
      filesToAdd,
    }).unwrap();
    setIsEditing(false);
    setFilesToAdd([]);
    setMediaToRemove([]);
  };

  const onDelete = async () => {
    await deletePost({ postId: post.id, authorId: post.author.id }).unwrap();
  };
  return (
    <Card className="mb-3">
      <Card.Body>
        {!isEditing ? (
          <>
            <Card.Title>{post.title}</Card.Title>
            <Card.Text>{post.description}</Card.Text>
          </>
        ) : (
          <>
            <Form.Group className="mb-2">
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </>
        )}

        {/* MEDIA */}
        {post.media?.length ? (
          <ListGroup variant="flush" className="mb-3">
            {post.media.map((m) => (
              <ListGroup.Item key={m.id}>
                <img
                  src={m.url}
                  alt="post media"
                  style={{
                    width: "100%",
                    maxHeight: "400px",
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}
                />

                {isEditing && (
                  <Form.Check
                    className="mt-2"
                    type="checkbox"
                    label="Remove"
                    checked={mediaToRemove.includes(m.id)}
                    onChange={(e) => {
                      setMediaToRemove((prev) =>
                        e.target.checked
                          ? [...prev, m.id]
                          : prev.filter((x) => x !== m.id),
                      );
                    }}
                  />
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : null}

        {/* ADD FILES */}
        {isEditing && (
          <Form.Group className="mb-3">
            <Form.Control
              type="file"
              multiple
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFilesToAdd(Array.from(e.currentTarget.files ?? []));
              }}
            />
          </Form.Group>
        )}

        {/* ACTIONS */}
        {canEdit && (
          <div className="d-flex gap-2">
            {!isEditing ? (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            ) : (
              <>
                <Button size="sm" onClick={onSave} disabled={updating}>
                  {updating ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </>
            )}

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
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
export default PostCard;
