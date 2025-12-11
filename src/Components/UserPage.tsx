import { useAppSelector } from "../store/hooks";
import { useEffect, useState } from "react";
import {
  useGetMyProfileQuery,
  useGetMyDepartmentsQuery,
  useUpdateMyProfileMutation,
  useUploadAvatarMutation,
} from "../api/userApi";

import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
  Form,
  ListGroup,
  Button,
  InputGroup,
} from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const UserPage = () => {
  useGetMyProfileQuery();
  useGetMyDepartmentsQuery();

  //Dati profilo e departments dal Redux
  const { profile, departments, loading, error } = useAppSelector(
    (state) => state.profile
  );

  //Stati locali
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [updateMyProfile] = useUpdateMyProfileMutation();
  const [uploadAvatar] = useUploadAvatarMutation();

  //Quando profile arriva da Redux, riempio i campi del form
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setSurname(profile.surname);
      setEmail(profile.email);
    }
  }, [profile]);

  // Submit per aggiornare dati user
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const payload: {
        name: string;
        surname: string;
        email: string;
        password?: string;
      } = {
        name,
        surname,
        email,
        password,
      };
      if (password.trim()) {
        payload.password = password;
      }
      // RTK Query
      await updateMyProfile(payload).unwrap();
      // svuoto password dopo salvataggio
      setPassword("");
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };
  // Upload Avatar
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    try {
      await uploadAvatar(file).unwrap();
      alert("Avatar updated!");
    } catch (err) {
      console.error("Error uploading avatar:", err);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <h2>My Profile</h2>
        </Col>
      </Row>

      {/* Se loading è true, mostro uno spinner centrale */}
      {loading && (
        <Row className="mb-3">
          <Col className="text-center">
            <Spinner animation="border" />
          </Col>
        </Row>
      )}

      {/* Messaggio di errore globale */}
      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      <Row>
        {/* Colonna sinistra: info base + avatar */}
        <Col xs={12} md={4} className="mb-4">
          <Card className="text-center">
            <Card.Body>
              {profile && profile.avatar && (
                <div className="mb-3">
                  <img
                    src={profile.avatar}
                    alt="avatar"
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
              <Form.Group controlId="formAvatar" className="mb-3">
                <Form.Label>Change avatar</Form.Label>
                <Form.Control type="file" onChange={handleAvatarChange} />
              </Form.Group>

              {profile && (
                <>
                  <Card.Title>
                    {profile.name} {profile.surname}
                  </Card.Title>
                  <Card.Text>{profile.email}</Card.Text>
                </>
              )}
            </Card.Body>
          </Card>

          {/* Lista departments e ruoli */}
          <Card className="mt-4">
            <Card.Header>Departments & Roles</Card.Header>
            <ListGroup variant="flush">
              {departments.length === 0 && (
                <ListGroup.Item>No departments assigned.</ListGroup.Item>
              )}
              {departments.map((dep) => (
                <ListGroup.Item key={dep.departmentId}>
                  <strong>{dep.departmentName}</strong>
                  <br />
                  <span>Roles: {dep.roles.join(", ")}</span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        {/* Colonna destra: form di modifica dati */}
        <Col xs={12} md={8}>
          <Card>
            <Card.Body>
              <h4>Edit Profile</h4>
              <Form onSubmit={handleSubmit} className="mt-3">
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formSurname">
                  <Form.Label>Surname</Form.Label>
                  <Form.Control
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>New Password (optional)</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave empty to keep current password"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword((prev) => !prev)}
                      type="button"
                    >
                      {showPassword ? <BsEyeSlash /> : <BsEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save changes"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserPage;
