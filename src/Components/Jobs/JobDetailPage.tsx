import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetJobByIdQuery } from "../../api/jobApi";
import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Spinner,
} from "react-bootstrap";
import ApplyJobModal from "./ApplyJobModal";
import { formatLabel } from "../../utils/formatLabel";
import "../../css/Jobs.css";

const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  //  modal per candidarsi
  const [showApplyModal, setShowApplyModal] = useState(false);

  const {
    data: job,
    isLoading,
    isError,
  } = useGetJobByIdQuery(id!, {
    // se id non e presente nell'URL
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Unable to load this job opening.</Alert>

        <Button variant="outline-secondary" onClick={() => navigate("/jobs")}>
          Back to jobs
        </Button>
      </Container>
    );
  }

  return (
    <Container className="job-detail-page">
      <Button
        variant="link"
        onClick={() => navigate("/jobs")}
        className="job-back-btn mb-3"
      >
        Back to jobs
      </Button>

      <Card className="job-detail-card">
        <Card.Body className="p-4">
          <div className="job-detail-top">
            <div>
              <h2 className="job-detail-title mb-2">{job.title}</h2>
              {job.department && (
                <div className="job-department mb-3">{job.department.name}</div>
              )}
              <div className="job-badges">
                <Badge bg="primary">{formatLabel(job.employmentType)}</Badge>
                <Badge bg="info">{formatLabel(job.workMode)}</Badge>
                {job.location && (
                  <Badge bg="light" text="dark">
                    {job.location}
                  </Badge>
                )}
                <Badge bg={job.status === "OPEN" ? "success" : "secondary"}>
                  {formatLabel(job.status)}
                </Badge>
              </div>
            </div>

            {job.status === "OPEN" && (
              <Button
                className="job-btn-primary"
                onClick={() => setShowApplyModal(true)}
              >
                Apply now
              </Button>
            )}
          </div>

          {job.applicationDeadline && (
            <div className="job-detail-deadline">
              <strong>Application deadline:</strong>
              {new Date(job.applicationDeadline).toLocaleDateString()}
            </div>
          )}

          <section className="job-detail-section">
            <h5>Job description</h5>
            <p className="mb-0" style={{ whiteSpace: "pre-line" }}>
              {job.description}
            </p>
          </section>

          {job.requirements && (
            <section className="mb-4">
              <h5>Requirements</h5>
              <p className="mb-0" style={{ whiteSpace: "pre-line" }}>
                {job.requirements}
              </p>
            </section>
          )}

          {job.createdAt && (
            <div className="job-published">
              <small>
                Published on {new Date(job.createdAt).toLocaleDateString()}
              </small>
            </div>
          )}
        </Card.Body>
      </Card>

      <ApplyJobModal
        show={showApplyModal}
        onHide={() => setShowApplyModal(false)}
        jobId={job.id}
        jobTitle={job.title}
      />
    </Container>
  );
};
export default JobDetailPage;
