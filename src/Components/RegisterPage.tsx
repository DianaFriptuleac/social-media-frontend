import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { registerThunk } from "../store/authSlice";

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  // State x form
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Invio form
  const handleSubmit = async (e: React.FormEvent) => {
    //React.FormEvent type di TS (da React) per tipizzare l’evento del form
    e.preventDefault(); // blocca il refresh della pagina
    // Invio il registerThunk al Redux store
    const resultAction = await dispatch(
      registerThunk({ name, surname, email, password })
    );

    //match - controlla se l’action restituita dal dispatch è del tipo "fulfilled" del thunk"
    if (registerThunk.fulfilled.match(resultAction)) {
      // dopo la registrazione vado al login
      navigate("/login");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <h2 className="text-center mb-4">Register</h2>

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

            {error && <Alert variant="danger">{error}</Alert>}

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>

            <p className="text-center mt-3">
              Already have an account?{" "}
              <Link to="/login" style={{ textDecoration: "none" }}>
                Login
              </Link>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
