import React, { useState } from "react";
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

  return (
    <Container className="auth-page">
      <Row className="justify-content-center w-100">
        <Col xs={12} md={6} lg={4}>
            <div className="auth-card">
          <div className="auth-card__header text-center">
            <h2 className="auth-title">Register</h2>
          </div>
          <div className="auth-card__body">
          {errorMessage && <Alert variant="danger" className="auth-alert">{errorMessage}</Alert>}
          <Form
            onSubmit={handleSubmit}
            className="p-4 border rounded shadow-sm"
          >
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Insert your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSurname">
              <Form.Label>Surname</Form.Label>
              <Form.Control
                type="text"
                placeholder="Insert your surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
              />
            </Form.Group>

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

            <Button type="submit" className="w-100 auth-btn-primary" disabled={isLoading}>
              {isLoading ? "Registration..." : "Register"}
            </Button>
            </Form>

           <div className="auth-divider" />
             <div className="auth-footer">
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Login
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
