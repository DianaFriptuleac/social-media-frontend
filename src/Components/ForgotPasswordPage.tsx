import { useEffect, useState } from "react";
import { useForgotPasswordMutation } from "../api/authApi";
import { Container, Row, Col, Alert, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../css/Auth.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  useEffect(() => {
    document.body.classList.add("auth-layout");
    return () => document.body.classList.remove("auth-layout");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await forgotPassword({ email }).unwrap();

    setMessage("If this email exists, you will receive a reset link.");
  };
  return (
    <Container className="auth-page">
      <Row className="justify-content-center w-100">
        <Col xs={12} md={8} lg={5} xl={4}>
          <div className="auth-card">
            <div className="auth-card__header">
              <div className="auth-brand">
                <div className="auth-brand__logo">•</div>
                <div className="auth-brand__name">ECOMOTORS</div>
              </div>

              <h2 className="auth-title">Forgot Password.</h2>
              <p className="auth-subtitle">
                Enter your email and we will send you a reset link.
              </p>
            </div>

            <div className="auth-card__body">
              {message && (
                <Alert variant="success" className="auth-alert">
                  {message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} className="auth-form">
                <Form.Group controlId="forgotEmail">
                  <Form.Label>Work Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="name@ecomotors.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="auth-btn-primary mt-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </Form>

              <div className="auth-bottom-text">
                Remember password?
                <Link to="/login" className="auth-link">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default ForgotPasswordPage;
