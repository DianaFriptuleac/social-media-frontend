import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import React, { useState } from "react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    //e: React.FormEvent) - tipo per TypeScript- evento di form React
    e.preventDefault();
    try {
      // chiamata API tramite RTK Query
      await login({ email, password }).unwrap();
      // se arrivo qui → login ok, authSlice è già stato aggiornato
      navigate("/home");
    } catch (err) {
      // l’errore viene già salvato in auth.error da authFailed
    }
  };
  return (
    <Container className="auth-page">
      <Row className="justify-content-center w-100">
        <Col xs={12} md={6} lg={4}>
          <div className="auth-card">
            <div className="auth-card__header text-center">
              <h2 className="auth-title">Login</h2>
            </div>

            <div className="auth-card__body">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Insert your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Insert your password"
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

                <Button
                  type="submit"
                  className="w-100 auth-btn-primary"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Form>

              <div className="auth-footer">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="auth-link">
                  Register
                </Link>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
