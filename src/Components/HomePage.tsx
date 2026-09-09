import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Pagination,
  Button,
} from "react-bootstrap";
import { useAppSelector } from "../store/hooks";
import "../css/Home.css";
import { useGetPostsQuery } from "../api/postApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllEventsQuery } from "../api/EventApi";
import { getPaginationRange } from "../utils/pagination";
import { useGetJobsQuery } from "../api/jobApi";
import CreatePostBox from "./Posts/CreatePostBox";
import PostCard from "./Posts/PostCard";
const HomePage = () => {
  const user = useAppSelector((state) => state.auth.user);

  const [page, setPage] = useState(0);
  const size = 10;
  const sortBy = "createdAt";

  const {
    data: postsPage,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetPostsQuery({ page, size, sortBy });

  const totalPages = postsPage?.totalPages ?? 0;
  const currentPage = postsPage?.number ?? page;

  const canGoPrev = currentPage > 0;
  const canGoNext = totalPages > 0 && currentPage < totalPages - 1;

  const pageNumbers = getPaginationRange(currentPage, totalPages, 5);
  const navigate = useNavigate();
  const {
    data: eventsPage,
    isLoading: eventsLoading,
    isError: eventsError,
  } = useGetAllEventsQuery({
    page: 0,
    size: 5,
  });

  const upcomingEvents =
    eventsPage?.content
      ?.filter((event) => new Date(event.startAt) >= new Date())
      .sort(
        (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
      ) ?? [];

  const {
    data: jobsPage,
    isLoading: jobsLoading,
    isError: jobsError,
  } = useGetJobsQuery({
    page: 0,
    size: 10,
  });

  return (
    <Container className="home-wrap">
      {/* HERO */}
      <Row className="mb-3">
        <Col className="px-0">
          <div className="home-hero">
            <div className="home-hero-content">
              <span className="home-hero-badge">Featured Update</span>
              <h1 className="home-hero-title">Welcome to EcoMotors.</h1>
              <p className="home-hero-sub">
                Share updates, discover team activity and keep track of the
                latest company news in one place.
              </p>

              <div className="home-hero-actions">
                <Button className="home-hero-btn home-hero-btn--primary">
                  Explore Feed
                </Button>
                <Button className="home-hero-btn home-hero-btn--secondary">
                  View Events
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      {/* LAYOUT */}
      <Row className="justify-content-center home-main-row">
        {/* LEFT */}
        <Col lg={3} className="d-none d-lg-block">
          <Card className="home-side-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="home-side-title mb-0">
                  Available Jobs
                </Card.Title>

                <Button
                  variant="link"
                  className="home-jobs-view-all"
                  onClick={() => navigate("/jobs")}
                >
                  View all
                </Button>
              </div>

              {jobsLoading && (
                <div className="text-center py-3">
                  <Spinner size="sm" />
                </div>
              )}

              {jobsError && (
                <div className="home-job">
                  <div className="home-job-title">Error loading jobs</div>
                </div>
              )}

              {!jobsLoading && !jobsError && jobsPage?.content.length === 0 && (
                <div className="home-job">
                  <div className="home-job-title">No open positions</div>
                  <div className="home-job-sub">Check back later.</div>
                </div>
              )}

              {jobsPage?.content.map((job) => (
                <div
                  key={job.id}
                  className="home-job home-job-clickable"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <div className="home-job-title">{job.title}</div>
                  {job.department && (
                    <div className="home-job-sub">{job.department.name}</div>
                  )}

                  <div className="home-job-meta">
                    <span>{job.employmentType.replaceAll("_", " ")}</span>
                  </div>

                  {job.location && (
                    <div className="home-job-sub"> {job.location}</div>
                  )}
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* CENTER */}
        <Col xs={12} md={8} lg={6} className="home-center">
          <CreatePostBox />

          <Card className="home-feed-card">
            <Card.Body>
              <div className="home-section-head">
                <h5 className="home-section-title">Team Feed</h5>

                <div className="d-flex align-items-center gap-2">
                  {isFetching && !isLoading ? (
                    <span className="home-fetching">Updating...</span>
                  ) : null}

                  {isError && (
                    <span
                      role="button"
                      className="home-retry-link"
                      onClick={() => refetch()}
                    >
                      Retry
                    </span>
                  )}
                </div>
              </div>

              {isLoading && (
                <div className="text-center py-4">
                  <Spinner animation="border" />
                </div>
              )}

              {isError && (
                <Alert variant="danger" className="mb-0">
                  Error loading posts.
                </Alert>
              )}

              {!isLoading && postsPage && postsPage.content.length === 0 && (
                <Alert variant="light" className="mb-0">
                  No posts yet.
                </Alert>
              )}

              <div className="home-post-list">
                {postsPage?.content.map((p) => (
                  <PostCard
                    key={p.id}
                    post={p}
                    canEdit={user?.id === p.author.id}
                  />
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination className="home-pagination mb-0">
                    <Pagination.Prev
                      disabled={!canGoPrev}
                      onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                    />

                    {/* se start > 0 mostro first + ellipsis */}
                    {pageNumbers.length > 0 && pageNumbers[0] > 0 && (
                      <>
                        <Pagination.Item onClick={() => setPage(0)}>
                          1
                        </Pagination.Item>
                        {pageNumbers[0] > 1 && <Pagination.Ellipsis disabled />}
                      </>
                    )}

                    {pageNumbers.map((p) => (
                      <Pagination.Item
                        key={p}
                        active={p === currentPage}
                        onClick={() => setPage(p)}
                      >
                        {p + 1}
                      </Pagination.Item>
                    ))}

                    {/* se end < last mostro ellipsis + last */}
                    {pageNumbers.length > 0 &&
                      pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                        <>
                          {pageNumbers[pageNumbers.length - 1] <
                            totalPages - 2 && <Pagination.Ellipsis disabled />}
                          <Pagination.Item
                            onClick={() => setPage(totalPages - 1)}
                          >
                            {totalPages}
                          </Pagination.Item>
                        </>
                      )}

                    <Pagination.Next
                      disabled={!canGoNext}
                      onClick={() =>
                        setPage((prev) => Math.min(totalPages - 1, prev + 1))
                      }
                    />
                  </Pagination>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* RIGHT */}
        <Col lg={3} className="d-none d-lg-block">
          <Card className="home-side-card">
            <Card.Body>
              <Card.Title className="home-side-title">Events</Card.Title>
              {eventsLoading && (
                <div className="text-center py-3">
                  <Spinner size="sm" />
                </div>
              )}

              {eventsError && (
                <div className="home-event">
                  <div className="home-event-title">Error loading events</div>
                </div>
              )}

              {!eventsLoading &&
                !eventsError &&
                upcomingEvents.length === 0 && (
                  <div className="home-event">
                    <div className="home-event-title">No upcoming events</div>
                    <div className="home-event-sub">Stay tuned.</div>
                  </div>
                )}
              {upcomingEvents.map((e) => (
                <div
                  key={e.id}
                  className="home-event home-event-clickable"
                  onClick={() => navigate(`/events/${e.id}`)}
                >
                  <div className="home-event-title fw-bold mt-2">{e.name}</div>
                  <div className="home-event-sub">
                    {new Date(e.startAt).toLocaleString()}
                  </div>
                  <div className="home-event-sub">
                    {e.location || "No location"}
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
