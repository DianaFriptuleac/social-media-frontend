import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { useGetUserByIdQuery } from "../api/userApi";
import {
  Alert,
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Card,
} from "react-bootstrap";
import UserRoleBadgeModal from "./UserRoleBadgeModal";
import "../css/Users.css";
import { useGetPostsByUserQuery } from "../api/postApi";
import PostCard from "./Posts/PostCard";

const SingleUserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const currentUser = useAppSelector((u) => u.auth.user);
  const isCurrentUserAdmin = currentUser?.role === "ADMIN";

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useGetUserByIdQuery(id!, {
    skip: !id,
  });
  if (!id) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">Missing user id</Alert>
      </Container>
    );
  }
  const {
    data: postsPage,
    isLoading: postsLoading,
    isError: postsError,
    refetch: refetchPosts,
  } = useGetPostsByUserQuery(
    { userId: id!, page: 0, size: 8, sortBy: "createdAt" },
    { skip: !id },
  );
  const canEditPosts = currentUser?.id === id;

  return (
    <Container className="mt-4 user-detail-page">
      <Row className="mb-3">
        <Col className="d-flex justify-content-between align-items-center">
          <h2 className="user-detail-title">User details</h2>
          <Button
            className="u-btn-outline"
            variant="outline-secondary"
            onClick={() => navigate("/users")}
          >
            Back
          </Button>
        </Col>
      </Row>

      {isLoading && (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      )}
      {isError && (
        <Alert variant="danger">
          Error loading user.{""}
          <Button variant="link" className="p-0" onClick={() => refetch()}>
            Retry
          </Button>
        </Alert>
      )}

      {user && (
        <Row>
          <Col xs={12} md={4} className="mb-4">
            <Card className="text-center u-card">
              <Card.Body>
                {user.avatar && (
                  <div className="mb-3">
                    <img src={user.avatar} alt="avatar" className="u-avatar" />
                  </div>
                )}

                <Card.Title>
                  {user.name} {user.surname}
                </Card.Title>
                <Card.Text>{user.email}</Card.Text>

                <div className="mt-2">
                  <UserRoleBadgeModal
                    currentRole={user.role}
                    userId={user.id}
                    isCurrentUserAdmin={isCurrentUserAdmin}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={8}>
            <Card className="u-card">
              <Card.Body>
                <h4>Info</h4>
                <div>
                  <strong>Username:</strong> {user.username}
                </div>
                <div>
                  <strong>Role:</strong> {user.role}
                </div>
                <div>
                  <strong>Email:</strong> {user.email}
                </div>
              </Card.Body>
            </Card>
            <Card className="u-card mt-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">Posts</h4>

                  {postsError && (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => refetchPosts()}
                    >
                      Retry
                    </Button>
                  )}
                </div>

                {postsLoading && (
                  <div className="text-center py-3">
                    <Spinner animation="border" />
                  </div>
                )}

                {postsError && (
                  <Alert variant="danger" className="mb-3">
                    Error loading posts.
                  </Alert>
                )}

                {!postsLoading &&
                  postsPage &&
                  postsPage.content.length === 0 && (
                    <Alert variant="light" className="mb-0">
                      No posts yet.
                    </Alert>
                  )}

                {postsPage?.content.map((p) => (
                  <PostCard key={p.id} post={p} canEdit={!!canEditPosts} />
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};
export default SingleUserDetail;
