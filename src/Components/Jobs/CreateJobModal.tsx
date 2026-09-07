import { useState } from "react";
import { useCreateJobMutation } from "../../api/jobApi";
import { Modal, Form, Alert, Button, Spinner } from "react-bootstrap";
import { useGetDepartmentsQuery } from "../../api/departmentApi";

interface CreateJobModalProps {
  show: boolean;
  onHide: () => void;
}

const CreateJobModal = ({ show, onHide }: CreateJobModalProps) => {
  const [createJob, { isLoading }] = useCreateJobMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("FULL_TIME");
  const [workMode, setWorkMode] = useState("OFFICE");
  const [departmentId, setDepartmentId] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [error, setError] = useState<string | null>(null);

  const {
    data: departmentsData,
    isLoading: isLoadingDepartments,
    isError: isDepartmentsError,
  } = useGetDepartmentsQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createJob({
        title,
        description,
        requirements: requirements || undefined,
        location: location || undefined,
        employmentType: employmentType as
          | "FULL_TIME"
          | "PART_TIME"
          | "INTERSHIP"
          | "TEMPORARY",
        workMode: workMode as "OFFICE" | "HYBRID" | "REMOTE",
        departmentId,
        applicationDeadline: applicationDeadline || null,
      }).unwrap();

      setTitle("");
      setDescription("");
      setRequirements("");
      setLocation("");
      setEmploymentType("FULL_TIME");
      setWorkMode("OFFICE");
      setDepartmentId("");
      setApplicationDeadline("");

      onHide();
    } catch (err) {
      console.error(err);
      setError("Unable to create the job position.");
    }
  };
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create job position</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Job title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Requirements</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Employment type</Form.Label>
            <Form.Select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
            >
              <option value="FULL_TIME">Full time</option>
              <option value="PART_TIME">Part time</option>

              <option value="INTERSHIP">Internship</option>
              <option value="TEMPORARY">Temporary</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Work mode</Form.Label>
            <Form.Select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
            >
              <option value="OFFICE">Office</option>
              <option value="HYBRID">Hybrid</option>
              <option value="REMOTE">Remote</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              disabled={isLoadingDepartments}
              required
            >
              <option value="">
                {isLoadingDepartments
                  ? "Loading departments..."
                  : "Select department"}
              </option>
              {departmentsData?.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </Form.Select>
            {isDepartmentsError && (
              <Form.Text className="text-danger">
                Unable to load departments.
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Label>Application deadline</Form.Label>
            <Form.Control
              type="date"
              value={applicationDeadline}
              onChange={(e) => setApplicationDeadline(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={isLoading}>
            Cancel
          </Button>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Creating...
              </>
            ) : (
              "Create job"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateJobModal;
