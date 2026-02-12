import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Pagination,
} from "react-bootstrap";
import { useAppSelector } from "../store/hooks";
import "../css/Home.css";
import { useGetPostsQuery } from "../api/postApi";
import { useState } from "react";
import { getPaginationRange } from "../utils/pagination";
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

  return (
    <Container fluid className="px-0 home-wrap">
      {/* HERO */}
      <Row className="mb-3">
        <Col className="px-0">
          <div className="home-hero">
            <div className="home-hero-content">
              <h1 className="home-hero-title">Let&apos;s build our future.</h1>
              <div className="home-hero-sub">
                Share updates, photos and news with your team.
              </div>
            </div>
          </div>
        </Col>
      </Row>
      {/* LAYOUT */}
      <Row className="justify-content-center g-3">
        {/* LEFT */}
        <Col lg={3} className="d-none d-lg-block">
          <Card className="home-side-card">
            <Card.Body>
              <Card.Title className="home-side-title">Shortcuts</Card.Title>
              <div className="text-muted small">
                (Placeholder) In futuro: menu, gruppi, scorciatoie.
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* CENTER */}
        <Col xs={12} md={8} lg={6} className="home-center">
          <CreatePostBox />

          <Card className="home-feed-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">Feed</h5>

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

              <div className="mt-3">
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
              <div className="text-muted small">
                (Placeholder) In futuro: eventi futuri, meeting, deadlines.
              </div>

              <div className="home-event mt-3">
                <div className="home-event-title">No events yet</div>
                <div className="home-event-sub">Stay tuned.</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
