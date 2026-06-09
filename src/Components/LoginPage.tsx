import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useLoginMutation } from "../api/authApi";
import "../css/auth.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  // mutation RTK Query
  const [login] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    //e: React.FormEvent) - tipo per TypeScript- evento di form React
    e.preventDefault();
    try {
      // chiamata API tramite RTK Query
      await login({ email, password, rememberMe }).unwrap();
      // se arrivo qui → login ok, authSlice è già stato aggiornato
      navigate("/home");
    } catch (err) {
      // l’errore viene già salvato in auth.error da authFailed
    }
  };
  useEffect(() => {
  document.body.classList.add("auth-layout");

  return () => {
    document.body.classList.remove("auth-layout");
  };
}, []);
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
              <h2 className="auth-title">Welcome Back.</h2>
              <p className="auth-subtitle">
                Access your corporate portal and insights.
              </p>
            </div>

            <div className="auth-card__body">
              <div className="auth-switch">
                <Link to="/login" className="auth-switch__item active">
                  Sign In
                </Link>
                <Link to="/register" className="auth-switch__item">
                  Create Account
                </Link>
              </div>

              <Form onSubmit={handleSubmit} className="auth-form">
                <Form.Group controlId="formEmail">
                  <Form.Label>Work Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="name@ecomotors.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formPassword">
                  <div className="auth-row-inline">
                    <Form.Label>Password</Form.Label>
                    <a href="#" className="auth-forgot">
                      Forgot?
                    </a>
                  </div>
                  <Form.Control
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                {error && (
                  <Alert variant="danger" className="auth-alert">
                    {error}
                  </Alert>
                )}
                <label className="auth-check">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Keep me authenticated for 30 days</span>
                </label>

                <Button
                  type="submit"
                  className="auth-btn-primary"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In to EcoMotors →"}
                </Button>
              </Form>

              <div className="auth-footer">
                Secure Enterprise Environment. Access is restricted to
                authorized personnel only.
                <div className="auth-footer-links">
                  <a href="#">Legal</a>
                  <a href="#">Privacy</a>
                  <a href="#">Support</a>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
