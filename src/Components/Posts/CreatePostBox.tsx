import { useState } from "react";
import { useCreatePostWithMediaMutation } from "../../api/postApi";
import { Card, Form, Alert, Button, Modal } from "react-bootstrap";
import "../../css/Posts.css";
import { useAppSelector } from "../../store/hooks";

const CreatePostBox = () => {
  const [createPost, { isLoading, error }] = useCreatePostWithMediaMutation();

  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const user = useAppSelector((s) => s.auth.user);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFiles([]);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPost({
      post: { title, description },
      files,
    }).unwrap();
    resetForm();
    setShow(false);
  };

  return (
    <>
      <Card className="createpost-card mb-3">
        <Card.Body>
          <div className="createpost-trigger">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="createpost-avatar"
              />
            ) : (
              <div className="createpost-avatar-placeholder">
                {user?.name?.[0]}
              </div>
            )}

            <div
              className="createpost-trigger-input"
              role="button"
              onClick={() => setShow(true)}
            >
              Create a post...
            </div>
          </div>

          <div className="createpost-actions">
            <Button
              className="createpost-action-btn"
              variant="outline-secondary"
              onClick={() => setShow(true)}
              type="button"
            >
              Foto / Video
            </Button>

            <Button
              className="createpost-action-btn"
              variant="outline-primary"
              onClick={() => setShow(true)}
              type="button"
            >
              Write
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Modal create post */}
      <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
        size="lg"
        className="createpost-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create post</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="postTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="postDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                className="createpost-textarea"
                placeholder="What's on your mind?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="postFiles">
              <Form.Label>Media</Form.Label>
              <Form.Control
                type="file"
                multiple // più file insieme
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFiles(Array.from(e.currentTarget.files ?? [])); //currentTarget è  l'input
                  //(Array like...)                                                 // TS sa che è HTMLInputElement (files esiste solo su HTMLInputElement)
                }}
              />
              {files.length > 0 && (
                <div className="post-meta mt-2">
                  Selected files: {files.length}
                </div>
              )}
            </Form.Group>

            {error && (
              <Alert variant="danger" className="mb-3">
                Error while creating the post
              </Alert>
            )}

            <div className="d-flex gap-2 justify-content-end">
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  setShow(false);
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default CreatePostBox;
