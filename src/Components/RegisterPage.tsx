import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useRegisterMutation } from "../api/authApi";
import "../css/auth.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  // mutation RTK Query per la registrazione
  const [register, { isLoading, error }] = useRegisterMutation();

  // State x form
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Invio form
  const handleSubmit = async (e: React.FormEvent) => {
    //React.FormEvent type di TS (da React) per tipizzare l’evento del form
    e.preventDefault(); // blocca il refresh della pagina
    try {
      await register({ name, surname, email, password }).unwrap();
      // dopo la registrazione vado al login
      navigate("/login");
    } catch (err) {
      // l’errore è già visibile in "error" della mutation
    }
  };
  // messaggio errore dalla mutation
  const errorMessage =
    (error as any)?.data?.message || (error as any)?.message || null;
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
              <h2 className="auth-title">Create Account.</h2>
              <p className="auth-subtitle">
                Join the platform and access your workspace.
              </p>
            </div>
            <div className="auth-card__body">
              <div className="auth-switch">
                <Link to="/login" className="auth-switch__item">
                  Sign In
                </Link>
                <Link to="/register" className="auth-switch__item active">
                  Create Account
                </Link>
              </div>
              {errorMessage && (
                <Alert variant="danger" className="auth-alert">
                  {errorMessage}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} className="auth-form">
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Insert your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formSurname">
                  <Form.Label>Surname</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Insert your surname"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    required
                  />
                </Form.Group>

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

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="auth-btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </Form>

              <div className="auth-bottom-text">
                Already have an account?{" "}
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

export default RegisterPage;
