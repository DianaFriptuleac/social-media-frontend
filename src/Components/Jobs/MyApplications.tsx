import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetMyApplicationsQuery,
  useWithdrawApplicationMutation,
} from "../../api/jobApi";
import { getPaginationRange } from "../../utils/pagination";
import {
  Container,
  Spinner,
  Alert,
  Button,
  Card,
  Badge,
  Pagination,
} from "react-bootstrap";
import type { ApplicationStatus } from "../../types/jobs";
import { formatLabel } from "../../utils/formatLabel";
import "../../css/Jobs.css";

const MyApplications = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useGetMyApplicationsQuery({
    page,
    size: 10,
  });

  const [withdrawApplication, { isLoading: isWithdrawing }] =
    useWithdrawApplicationMutation();

  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const paginationRange = data
    ? getPaginationRange(data.number, data.totalPages)
    : [];

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

  const handleWithdraw = async (applicationId: string) => {
    const confirmend = window.confirm(
      "Are you sure you want to withdraw this application?",
    );
    if (!confirmend) return;

    try {
      setWithdrawingId(applicationId);

      await withdrawApplication(applicationId).unwrap();
    } catch (error) {
      console.error("Error withdrawing application, ", error);
    } finally {
      setWithdrawingId(null);
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
        <Alert variant="danger">Unable to load your applications.</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-applications-page">
      <Button
        variant="link"
        className="job-back-btn mb-3"
        onClick={() => navigate("/jobs")}
      >
        Back to jobs
      </Button>

      <div>
        <h2 className="job-page-title">My applications</h2>

        <p className="job-page-subtitle">
          View and manage your job applications.
        </p>
      </div>

      {data?.content.length === 0 && (
        <Alert variant="light">You have not applied for any jobs yet.</Alert>
      )}

      <div className="d-grid gap-3">
        {data?.content.map((application) => {
          const canWithdraw =
            application.status === "SUBMITTED" ||
            application.status === "UNDER_REVIEW" ||
            application.status === "INTERVIEW";

          return (
            <Card key={application.id} className="job-application-card">
              <Card.Body>
                <div className="job-application-layout">
                  <div className="job-application-content">
                    <h5 className="my-application-title">
                      {application.job.title}
                    </h5>

                    {application.job.department && (
                      <div className="text-muted mb-3">
                        {application.job.department.name}
                      </div>
                    )}

                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <Badge bg={getBadgeVariant(application.status)}>
                        {formatLabel(application.status)}
                      </Badge>

                      <Badge bg="light" text="dark">
                        {formatLabel(application.job.employmentType)}
                      </Badge>

                      <Badge bg="light" text="dark">
                        {formatLabel(application.job.workMode)}
                      </Badge>

                      {application.job.status && (
                        <Badge
                          bg={
                            application.job.status === "OPEN"
                              ? "success"
                              : "secondary"
                          }
                        >
                          Job {formatLabel(application.job.status)}
                        </Badge>
                      )}
                    </div>

                    <div className="mb-2">
                      <strong>Applied on:</strong>{" "}
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </div>

                    {application.job.applicationDeadline && (
                      <div className="mb-2">
                        <strong>Application deadline:</strong>{" "}
                        {new Date(
                          application.job.applicationDeadline,
                        ).toLocaleDateString()}
                      </div>
                    )}

                    {application.job.location && (
                      <div className="mb-3">
                        <strong>Location:</strong> {application.job.location}
                      </div>
                    )}

                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="job-btn-secondary"
                        onClick={() => navigate(`/jobs/${application.job.id}`)}
                      >
                        View job
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-secondary"
                        className="job-btn-secondary"
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
                          className="job-btn-secondary"
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
                    {canWithdraw && (
                      <Button
                        variant="outline-danger"
                        disabled={
                          isWithdrawing && withdrawingId === application.id
                        }
                        onClick={() => handleWithdraw(application.id)}
                      >
                        {isWithdrawing && withdrawingId === application.id
                          ? "Withdrawing..."
                          : "Withdraw"}
                      </Button>
                    )}
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

export default MyApplications;
