import { useState } from "react";
import {
  useDeletePostMutation,
  useGetPostLikeStatusQuery,
  useLikePostMutation,
  useUnlikePostMutation,
  useGetPostLikeUsersQuery,
  useUpdatePostWithMediaMutation,
} from "../../api/postApi";
import type { PostResponseDTO } from "../../types/post";
import {
  Card,
  Form,
  Button,
  Spinner,
  Modal,
  ListGroup,
  Image,
} from "react-bootstrap";
import ExpandableText from "./ExpandableText";
import PostMediaCarousel from "./PostMediaCarousel";
import SharePostModal from "./SharePostModal";
import CommentsSection from "./CommentsSection";
import "../../css/Posts.css";
import {
  IoHeart,
  IoHeartOutline,
  IoShareSocial,
  IoChatbubbleOutline,
} from "react-icons/io5";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

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

  // Likes
  const [showLikes, setShowLikes] = useState(false);
  const { data: likeStatus, isLoading: likeStatusLoading } =
    useGetPostLikeStatusQuery({ postId: post.id });
  const [likePost, { isLoading: liking }] = useLikePostMutation();
  const [unlikePost, { isLoading: unliking }] = useUnlikePostMutation();
  const isToggling = liking || unliking;

  //carica lista users solo quando apro il modale
  const {
    data: likeUsers,
    isLoading: likeUsersLoading,
    error: likeUsersError,
  } = useGetPostLikeUsersQuery({ postId: post.id }, { skip: !showLikes });

  const likedByMe = likeStatus?.likedByMe ?? false;
  const likeCount = likeStatus?.likeCount ?? 0;

  const onToggleLike = async () => {
    try {
      if (likedByMe) {
        await unlikePost({ postId: post.id }).unwrap();
      } else {
        await likePost({ postId: post.id }).unwrap();
      }
    } catch (e) {
      console.error(e);
    }
  };

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
          <div className="post-actions-bar">
            <Button
              className="post-action-btn"
              onClick={() => setShowShare(true)}
            >
              <IoShareSocial size={18} />
            </Button>
            {/* COMMENTS */}
            <Button
              className={`post-action-btn ${showComments ? "active" : ""}`}
              onClick={() => setShowComments((v) => !v)}
            >
              <IoChatbubbleOutline size={18} />
            </Button>
            {/* LIKE */}
            <Button
              className={`post-action-btn ${likedByMe ? "active" : ""}`}
              disabled={isToggling || likeStatusLoading}
            >
              {/* CLICK SOLO SUL CUORE */}
              <span
                onClick={onToggleLike}
                style={{ display: "flex", alignItems: "center" }}
              >
                {likedByMe ? (
                  <IoHeart size={18} />
                ) : (
                  <IoHeartOutline size={18} />
                )}
              </span>

              {/* CLICK SOLO SUL NUMERO */}
              <span
                className="like-count"
                onClick={() => likeCount > 0 && setShowLikes(true)}
              >
                {likeCount}
              </span>
            </Button>
          </div>
          {/* RIGHT SIDE - EDIT / DELETE */}
          {canEdit && (
            <div className="post-owner-actions">
              <Button
                className="post-action-btn"
                onClick={() => setIsEditing(true)}
              >
                <FiEdit2 size={16} />
              </Button>

              <Button
                className="post-action-btn danger"
                onClick={() => setShowDelete(true)}
                disabled={deleting}
              >
                <RiDeleteBin6Line size={16} />
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
      {/* Modal Likes */}
      <Modal show={showLikes} onHide={() => setShowLikes(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Likes ({likeCount})</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {likeUsersLoading ? (
            <div className="d-flex align-items-center gap-2">
              <Spinner size="sm" />
              <span>Loading...</span>
            </div>
          ) : likeUsersError ? (
            <div className="text-danger">Error loading likes</div>
          ) : !likeUsers?.users?.length ? (
            <div>No likes yet</div>
          ) : (
            <ListGroup variant="flush">
              {likeUsers.users.map((u) => (
                <ListGroup.Item
                  key={u.id}
                  className="d-flex align-items-center gap-2"
                >
                  {u.avatar ? (
                    <Image
                      src={u.avatar}
                      roundedCircle
                      width={32}
                      height={32}
                      alt={`${u.name} ${u.surname}`}
                    />
                  ) : (
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "#ddd",
                      }}
                    />
                  )}
                  <div className="d-flex flex-column">
                    <span>
                      {u.name} {u.surname}
                    </span>
                    {u.role ? (
                      <small className="text-muted">{u.role}</small>
                    ) : null}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLikes(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};
export default PostCard;
