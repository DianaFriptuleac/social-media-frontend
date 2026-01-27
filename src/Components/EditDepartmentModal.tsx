import { useEffect, useMemo, useState } from "react";
import type { EditDepartmentModalProps } from "../types/departments";
import { Alert, Modal, Form, Button, Spinner } from "react-bootstrap";

const EditDepartmentModal = ({
  show,
  onHide,
  department,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
  errorMsg,
}: EditDepartmentModalProps) => {
  const [name, setName] = useState(department.name);
  const [description, setDescription] = useState(department.description ?? "");

  useEffect(() => {
    //Reset al cambio dati
    if (show) {
      setName(department.name);
      setDescription(department.description ?? "");
    }
  }, [show, department]);

  const canSave = useMemo(() => {
    const n = name.trim();
    const d = description.trim();
    if (!n) return false;

    const changed =
      n !== (department.name ?? "").trim() ||
      d !== (department.description ?? "").trim();

    return changed && !isSaving && !isDeleting;
  }, [name, description, department, isSaving, isDeleting]);

  const handleSave = () => {
    onSave({
      id: department.id,
      name: name.trim(),
      description: description.trim(),
    });
  };

  const handleDelete = () => {
    const ok = window.confirm(
      `Delete department "${department.name}" ? This will remove all memberships.`
    );
    if (!ok) return;
    onDelete(department.id);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit department</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Department name"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Department description"
            />
          </Form.Group>
        </Form>
        <hr />

        <div className="d-flex justify-content-between align-items-center">
          <div className="text-muted small">
            Users in department: {department.userCount}
          </div>
          <Button
            variant="outline-danger"
            onClick={handleDelete}
            disabled={isSaving || isDeleting}
          >
            {isDeleting ? (
              <>
                {" "}
                <Spinner size="sm" className="me-2" /> Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onHide}
          disabled={isSaving || isDeleting}
        >
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={!canSave}>
          {isSaving ? (
            <>
              <Spinner size="sm" className="me-2" />
              Saving...
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default EditDepartmentModal;
