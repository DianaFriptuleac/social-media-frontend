import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPaginationRange } from "../../utils/pagination";
import { formatLabel } from "../../utils/formatLabel";
import {
  useGetApplicationsByJobQuery,
  useUpdateApplicationStatusMutation,
} from "../../api/jobApi";
import type { ApplicationStatus } from "../../types/jobs";
import {
  Container,
  Spinner,
  Alert,
  Button,
  Card,
  Badge,
  Form,
  Pagination,
} from "react-bootstrap";
import "../../css/Jobs.css";

const JobApplicationsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useGetApplicationsByJobQuery(
    {
      jobId: id!,
      page,
      size: 10,
    },
    { skip: !id },
  );

  const paginationRange = data
    ? getPaginationRange(data.number, data.totalPages)
    : [];

  const [updateApplicationStatus, { isLoading: isUpdating }] =
    useUpdateApplicationStatusMutation();

  const [selectedStatuses, setSelectedStatuses] = useState<
    Record<string, ApplicationStatus>
  >({});

  const handleStatusChange = (
    applicationId: string,
    status: ApplicationStatus,
  ) => {
    setSelectedStatuses((prev) => ({
      ...prev,
      [applicationId]: status,
    }));
  };

  const handleUpdateStatus = async (
    applicationId: string,
    currentStatus: ApplicationStatus,
  ) => {
    const newStatus = selectedStatuses[applicationId] || currentStatus;

    try {
      await updateApplicationStatus({
        applicationId,
        status: newStatus,
      }).unwrap();
    } catch (error) {
      console.error("Error uploading application status ", error);
    }
  };

  const getBadgeVariant = (status: ApplicationStatus) => {
    switch (status) {
      case "SUBMITTED":
        return "secondary";

      case "UNDER_REVIEW":
        return "info";

      case "INTERVIEW":
        return "warning";

      case "ACCEPTED":
        return "success";

      case "REJECTED":
        return "danger";

      case "WITHDRAWN":
        return "dark";

      default:
        return "secondary";
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
      <Container className="py-4">
        <Alert variant="danger">Unable to load job applications.</Alert>
      </Container>
    );
  }

  return (
    <Container className="job-applications-page">
      <Button
        variant="link"
        className="job-back-btn mb-3"
        onClick={() => navigate("/jobs")}
      >
        Back to jobs
      </Button>

      <div className="job-page-header">
        <div>
          <h2 className="job-page-title">Job applications</h2>

          <p className="job-page-subtitle">
            Review applications submitted for this position.
          </p>
        </div>
      </div>

      {data?.content.length === 0 && (
        <Alert variant="light">
          There are no applications for this position.
        </Alert>
      )}

      <div className="d-grid gap-3">
        {data?.content.map((application) => {
          const selectedStatus =
            selectedStatuses[application.id] || application.status;

          return (
            <Card key={application.id} className="job-application-card">
              <Card.Body>
                <div className="job-application-layout">
                  <div className="job-application-content">
                    <h5 className="job-applicant-name">
                      {application.applicant.name}{" "}
                      {application.applicant.surname}
                    </h5>

                    {application.applicant.email && (
                      <div className="job-applicant-email mb-3">
                        {application.applicant.email}
                      </div>
                    )}

                    <div className="mb-3">
                      <Badge bg={getBadgeVariant(application.status)}>
                        {formatLabel(application.status)}
                      </Badge>
                    </div>

                    <div className="mb-2">
                      <strong>Applied on:</strong>{" "}
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </div>

                    <div className="d-flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        href={application.cvUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open CV
                      </Button>

                      {application.coverLetterUrl && (
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          href={application.coverLetterUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open cover letter
                        </Button>
                      )}
                    </div>

                    {application.coverLetterText && (
                      <div className="job-cover-letter">
                        <strong>Cover letter</strong>

                        <p
                          className="mb-0 mt-1"
                          style={{
                            whiteSpace: "pre-line",
                          }}
                        >
                          {application.coverLetterText}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="job-status-panel">
                    <Form.Group className="mb-2">
                      <Form.Label>Application status</Form.Label>

                      <Form.Select
                        value={selectedStatus}
                        disabled={application.status === "WITHDRAWN"}
                        onChange={(e) =>
                          handleStatusChange(
                            application.id,
                            e.target.value as ApplicationStatus,
                          )
                        }
                      >
                        <option value="SUBMITTED">Submitted</option>

                        <option value="UNDER_REVIEW">Under review</option>

                        <option value="INTERVIEW">Interview</option>

                        <option value="ACCEPTED">Accepted</option>

                        <option value="REJECTED">Rejected</option>

                        {application.status === "WITHDRAWN" && (
                          <option value="WITHDRAWN">Withdrawn</option>
                        )}
                      </Form.Select>
                    </Form.Group>

                    <Button
                      className="w-100"
                      disabled={
                        isUpdating ||
                        application.status === "WITHDRAWN" ||
                        selectedStatus === application.status
                      }
                      onClick={() =>
                        handleUpdateStatus(application.id, application.status)
                      }
                    >
                      {isUpdating ? "Updating..." : "Update status"}
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>

      {data && data.totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
          <Pagination.Prev
            disabled={data.first}
            onClick={() => setPage((prev) => prev - 1)}
          />

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
    </Container>
  );
};

export default JobApplicationsPage;
