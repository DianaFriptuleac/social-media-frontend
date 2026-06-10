import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useResetPasswordMutation } from "../api/authApi";
import { Container, Row, Col, Alert, Form, Button} from "react-bootstrap";
import "../css/Auth.css"

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";

    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [localError, setLocalError] = useState("");

    const [resetPassword, {isLoading}] = useResetPasswordMutation();

      useEffect(() => {
    document.body.classList.add("auth-layout");
    return () => document.body.classList.remove("auth-layout");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if(!token) {
        setLocalError("Invalid reset link.");
        return;
    }
    if(newPassword !== confirmPassword) {
        setLocalError("Passwords do not match");
        return;
    }
    await resetPassword({token, newPassword}).unwrap();
    
    navigate("/login");
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

              <h2 className="auth-title">New Password.</h2>
              <p className="auth-subtitle">
                Create a new password for your account.
              </p>
            </div>

            <div className="auth-card__body">
              {localError && (
                <Alert variant="danger" className="auth-alert">
                  {localError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} className="auth-form">
                <Form.Group controlId="newPassword">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="auth-btn-primary mt-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Reset Password"}
                </Button>
              </Form>

              <div className="auth-bottom-text">
                <Link to="/login" className="auth-link">
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPasswordPage;