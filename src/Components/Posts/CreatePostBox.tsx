import { useState } from "react";
import { useCreatePostWithMediaMutation } from "../../api/postApi";
import { Card, Form, Alert, Button} from "react-bootstrap";

const CreatePostBox = () => {
  const [createPost, { isLoading, error }] = useCreatePostWithMediaMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPost({
      post: { title, description },
      files,
    }).unwrap();
    setTitle("");
    setDescription("");
    setFiles([]);
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Create Post</Card.Title>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3" controlId="postTitle">
            <Form.Control
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="postDescription">
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="What's on your mind?"
              value={description}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

              <Form.Group className="mb-3" controlId="postFiles">
            <Form.Control
              type="file"
              multiple
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFiles(Array.from(e.currentTarget.files ?? []));
              }}
            />
          </Form.Group>

          {error && (
            <Alert variant="danger" className="mb-3">
              Error while creating the post
            </Alert>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Publishing..." : "Publish"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};
export default CreatePostBox;
