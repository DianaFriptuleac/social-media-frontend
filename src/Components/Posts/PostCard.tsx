import { useState } from "react";
import {
  useDeletePostMutation,
  useUpdatePostWithMediaMutation,
} from "../../api/postApi";
import type { PostResponseDTO } from "../../types/post";
import { Card, Form, Button, Spinner, Modal } from "react-bootstrap";
import ExpandableText from "./ExpandableText";
import PostMediaCarousel from "./PostMediaCarousel";
import SharePostModal from "./SharePostModal";
import CommentsSection from "./CommentsSection";
import "../../css/Posts.css";

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
  const [showDelete, setShowDelete] = useState(false);
  const [title, setTitle] = useState(post.title ?? "");
  const [description, setDescription] = useState(post.description ?? "");
  const [filesToAdd, setFilesToAdd] = useState<File[]>([]);
  const [mediaToRemove, setMediaToRemove] = useState<string[]>([]);
  const [showShare, setShowShare] = useState(false);

  const [showComments, setShowComments] = useState(false);

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
    try {
      await deletePost({ postId: post.id, authorId: post.author.id }).unwrap();
      setShowDelete(false);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <Card className="post-card mb-3">
      <Card.Body>
        {!isEditing ? (
          <>
            <Card.Title>{post.title}</Card.Title>
            <ExpandableText text={post.description} lines={2} />
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
          <>
            <PostMediaCarousel media={post.media} />

            {isEditing && (
              <div className="mt-2">
                {post.media.map((m) => (
                  <Form.Check
                    key={m.id}
                    className="mb-1"
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
                ))}
              </div>
            )}
          </>
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
        <div className="post-actions d-flex justify-content-between align-items-center mt-2">
          {/* LEFT SIDE - SHARE */}
          <div>
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() => setShowShare(true)}
            >
              Share
            </Button>
            <Button
              size="sm"
              variant={showComments ? "secondary" : "outline-secondary"}
              onClick={() => setShowComments((v) => !v)}
            >
              {showComments ? "Hide comments" : "Comments"}
            </Button>
          </div>
          {/* RIGHT SIDE - EDIT / DELETE */}
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
                onClick={() => setShowDelete(true)}
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
        </div>
        {showComments && (
  <CommentsSection postId={post.id} postAuthorId={post.author.id} />
)}
        <SharePostModal
          show={showShare}
          onHide={() => setShowShare(false)}
          postId={post.id}
        />
      </Card.Body>
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete post</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete this post? This action cannot be
          undone.
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDelete(false)}
            disabled={deleting}
          >
            Cancel
          </Button>

          <Button variant="danger" onClick={onDelete} disabled={deleting}>
            {deleting ? (
              <>
                <Spinner size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              "Yes, delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};
export default PostCard;
