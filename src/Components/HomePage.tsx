import { Container, Row, Col, Card } from "react-bootstrap";
import { useAppSelector } from "../store/hooks";
const HomePage = () => {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <Container className="mt-5">
      <Row className="justify-content-between align-items-center mb-4">
        <Col>
          <h2>Home</h2>
        </Col>
        <Col className="text-end"></Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              {user ? (
                <>
                  <Card.Title>
                    Welcome, {user.name} {user.surname}
                  </Card.Title>
                  <Card.Text>Email: {user.email}</Card.Text>
                  {user.avatar && (
                    <div className="mt-3 text-center">
                      <img
                        src={user.avatar}
                        alt="avatar"
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <Card.Text>
                  You are not logged in. Please login to see your profile.
                </Card.Text>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
