import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useLoginMutation } from "../api/authApi";

const LoginPage = () => {
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

   // mutation RTK Query
  const [login] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
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
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <h2 className="text-center mb-4">Login</h2>

          <Form
            onSubmit={handleSubmit}
            className="p-4 border rounded shadow-sm"
          >
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

            {error && <Alert variant="danger">{error}</Alert>}

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <p className="text-center mt-3">
              Don't have an account?{" "}
              <Link to="/register" style={{ textDecoration: "none" }}>
                Register
              </Link>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
