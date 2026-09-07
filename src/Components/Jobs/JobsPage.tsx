import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { useState } from "react";
import {
  useCloseJobMutation,
  useDeleteJobMutation,
  useGetJobsQuery,
} from "../../api/jobApi";
import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Spinner,
  Pagination,
} from "react-bootstrap";
import CreateJobModal from "./CreateJobModal";
import { getPaginationRange } from "../../utils/pagination";

const JobsPage = () => {
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === "ADMIN";

  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useGetJobsQuery({ page, size: 10 });
  const paginationRange = data
    ? getPaginationRange(data.number, data.totalPages)
    : [];
    
  const [closeJob] = useCloseJobMutation();
  const [deleteJob] = useDeleteJobMutation();
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);

  // close job
  const handleCloseJob = async (jobId: string) => {
    try {
      await closeJob(jobId).unwrap();
    } catch (error) {
      console.error("Error closing job: ", error);
    }
  };

  // delete job
  const handleDeleteJob = async (jobId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?",
    );

    if (!confirmed) return;

    try {
      await deleteJob(jobId).unwrap();
    } catch (error) {
      console.error("Error deleting job: ", error);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (isError) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Unable to load job openings.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Careers</h2>
          <p className="text-muted mb-0">
            Discover internal job opportunities.
          </p>
        </div>
        {/* ADMIN */}

        {isAdmin && (
          <Button onClick={() => setShowCreateJobModal(true)}>
            Create position
          </Button>
        )}
      </div>

      {/* My Applications */}
      <div className="mb-4">
        <Button
          variant="outline-primary"
          onClick={() => navigate("/jobs/my-applications")}
        >
          My applications
        </Button>
      </div>

      {/* NO JOBS */}
      {data?.content.length === 0 && (
        <Alert variant="light">There are currently no open positions.</Alert>
      )}

      {/* JOB cards */}
      <div className="d-grid gap-3">
        {data?.content.map((job) => (
          <Card key={job.id}>
            <Card.Body>
              <div className="d-flex justify-content-between gap-3">
                <div>
                  <Card.Title>{job.title}</Card.Title>
                  {job.department && (
                    <div className="text-muted mb-2">{job.department.name}</div>
                  )}

                  <div className="d-flex gap-2 flex-wrap mb-3">
                    <Badge bg="secondary">{job.employmentType}</Badge>

                    <Badge bg="info">{job.workMode}</Badge>

                    {job.location && (
                      <Badge bg="light" text="dark">
                        {job.location}
                      </Badge>
                    )}
                  </div>

                  {job.applicationDeadline && (
                    <small className="text-muted">
                      Apply before:{" "}
                      {new Date(job.applicationDeadline).toLocaleDateString()}
                    </small>
                  )}
                </div>
                <div className="d-flex flex-column gap-2">
                  <Button size="sm" onClick={() => navigate(`/jobs/${job.id}`)}>
                    View
                  </Button>

                  {/* ADMIN */}

                  {isAdmin && (
                    <>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => navigate(`/jobs/${job.id}/applications`)}
                      >
                        Applications
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-warning"
                        onClick={() => handleCloseJob(job.id)}
                      >
                        Close
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* PAGINATION */}

      {data && data.totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
          <Pagination.Prev
            disabled={data.first}
            onClick={() => setPage((prev) => prev - 1)}
          />
          {/*Nr. pagination */}
          {paginationRange.map((pageNumber) => (
            <Pagination.Item
              key={pageNumber}
              active={pageNumber === data.number}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={data.last}
            onClick={() => setPage((prev) => prev + 1)}
          />
        </Pagination>
      )}

      <CreateJobModal
        show={showCreateJobModal}
        onHide={() => setShowCreateJobModal(false)}
      />
    </Container>
  );
};
export default JobsPage;
