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
    <Container className="user-detail-page">
      <Row className="user-detail-header mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <div>
            <span className="u-kicker">Talent Profile</span>
            <h2 className="user-detail-title">User details</h2>
          </div>
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
        <Row className="g-4">
          <Col xs={12} md={4}>
            <Card className="text-center u-card user-detail-profile-card">
              <Card.Body>
                <div className="user-detail-cover" />
                <div className="user-detail-avatar-wrap">
                  {user.avatar ? (
                    <img src={user.avatar} alt="avatar" className="u-avatar" />
                  ) : (
                    <div className="u-avatar user-detail-avatar-placeholder">
                      {user.name?.[0]}
                      {user.surname?.[0]}
                    </div>
                  )}
                </div>

                <Card.Title className="user-detail-name">
                  {user.name} {user.surname}
                </Card.Title>
                <Card.Text className="user-detail-email">
                  {user.email}
                </Card.Text>

                <div className="mt-3">
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
            <Card className="u-card user-detail-info-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <span className="u-kicker">About me</span>
                    <h4 className="user-detail-section-title">Info</h4>
                  </div>
                </div>

                <div className="user-info-list">
                  <div className="user-info-row">
                    <span>Username</span> <strong>{user.username}</strong>
                  </div>
                  <div className="user-info-row">
                    <span>Role</span>
                    <strong>{user.role}</strong>
                  </div>
                  <div className="user-info-row">
                    <span>Email</span> <strong>{user.email}</strong>
                  </div>
                </div>
              </Card.Body>
            </Card>
            <Card className="u-card user-detail-posts-card mt-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <span className="u-kicker">Network activity</span>
                    <h4 className="user-detail-section-title">Posts</h4>
                  </div>

                  {postsError && (
                    <Button
                      className="u-btn-outline"
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

                <div className="user-detail-posts-list">
                  {postsPage?.content.map((p) => (
                    <PostCard key={p.id} post={p} canEdit={!!canEditPosts} />
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};
export default SingleUserDetail;
