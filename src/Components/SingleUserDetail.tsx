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
  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col className="d-flex justify-content-between align-items-center">
          <h2>User details</h2>
          <Button
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
            <Card className="text-center">
              <Card.Body>
                {user.avatar && (
                  <div className="mb-3">
                    <img
                      src={user.avatar}
                      alt="avatar"
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
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
            <Card>
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
          </Col>
        </Row>
      )}
    </Container>
  );
};
export default SingleUserDetail;
