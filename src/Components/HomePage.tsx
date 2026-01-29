import { Container, Row, Col, Card } from "react-bootstrap";
import { useAppSelector } from "../store/hooks";
import "../css/Home.css";
const HomePage = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <Container fluid className="px-0">
      {/* HERO */}
      <Row>
        <Col className="px-0">
          <div className="home-hero mb-3">
            <div className="home-hero-content">
              <h1 className="home-hero-title">Let&apos;s build our future.</h1>
              <div className="home-hero-sub">
                A private social space for employees: departments, roles, and
                collaboration—simple and professional.
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* PROFILE CARD */}
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="profile-card">
            <Card.Body>
              {user ? (
                <>
                  <Card.Title>
                    Welcome, {user.name} {user.surname}
                  </Card.Title>
                  {user.avatar && (
                    <div className="mt-3 text-center">
                      <img
                        src={user.avatar}
                        alt="avatar"
                        className="avatar-lg"
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
