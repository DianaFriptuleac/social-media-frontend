import { useEffect, useState } from "react";
import type { CreateDepartmentModalProps } from "../types/departments";
import { Alert, Modal, Form, Button, Spinner } from "react-bootstrap";
import "../css/Departments.css"

const CreateDepartmentModal = ({
  show,
  onHide,
  onCreate,
  isLoading,
  errorMsg,
}: CreateDepartmentModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

 useEffect(() => {
    if (!show) {
      setName("");
      setDescription("");
    }
  }, [show]);

  const handleClose = () => {
    setName("");
    setDescription("");
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="dept-modal">
      <Modal.Header closeButton>
        <Modal.Title>Create Department</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" className="dept-btn-secondary" onClick={handleClose}>
          Cancel
        </Button>

        <Button
          variant="primary"
          className="dept-btn-primary"
          disabled={!name.trim() || isLoading}
          onClick={() =>
            onCreate({
              name: name.trim(),
              description: description.trim() || undefined,
            })
          }
        >
          {isLoading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Creating...
            </>
          ) : (
            "Create"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default CreateDepartmentModal;