import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useState } from "react";
import { logout } from "../store/authSlice";
import { Navbar, Container, Nav, Offcanvas, Button } from "react-bootstrap";
import { BsPersonCircle, BsBoxArrowRight  } from "react-icons/bs";

const AppNavbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  //Stato per aprire e chiudere il menu laterale
  const [show, setShow] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setShow(false); // chiudo il menu dopo il click
  };

  return (
    <>
      <Navbar
        key="md"
        bg="dark"
        variant="dark"
        expand="md"
        className="mb-4"
        fixed="top" // sempre in alto
      >
        <Container fluid>
          {/* Brand / Home */}
          <Navbar.Brand
            style={{ cursor: "pointer" }}
            onClick={() => handleNavigate("/")}
          >
            MyApp
          </Navbar.Brand>

          {/* Hamburger per offcanvas su mobile */}
          <Navbar.Toggle
            aria-controls="offcanvasNavbar"
            onClick={() => setShow(true)}
          />

          {/* Parte destra: icona utente + logout (sempre visibile) */}
          <div className="d-flex align-items-center ms-auto">
            {user && (
              <span
                className="text-light me-3 d-flex align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => handleNavigate("/me")}
              >
                <BsPersonCircle size={24} className="me-1" />
               {/*  <span className="d-none d-sm-inline">
                  {user.name} {user.surname}
                </span> */}
              </span>
            )}
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
               <BsBoxArrowRight size={20} />
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* Offcanvas = menu laterale (tendina da sinistra) */}
      <Offcanvas
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
        placement="start"
        show={show}
        onHide={() => setShow(false)}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title id="offcanvasNavbarLabel">Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link onClick={() => handleNavigate("/")}>Home</Nav.Link>
            <Nav.Link onClick={() => handleNavigate("/departments")}>
              Departments
            </Nav.Link>
            <Nav.Link onClick={() => handleNavigate("/user")}>
              My Profile
            </Nav.Link>
        
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
export default AppNavbar;
