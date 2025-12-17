import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useState } from "react";
import { logout } from "../store/authSlice";
import { Navbar, Container, Nav, Offcanvas, Button } from "react-bootstrap";
import { BsPersonCircle, BsBoxArrowRight } from "react-icons/bs";
import "../css/Nav.css";
import { useEffect } from "react";

const AppNavbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  //Stato per aprire e chiudere il menu laterale
  const [show, setShow] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setShow(false); // chiudo il menu dopo il click
  };
  useEffect(() => {
    const wrapper = document.getElementById("page-wrapper");
    if (!wrapper) return;

    if (!isMobile && show) {
      wrapper.classList.add("push-right");
    } else {
      wrapper.classList.remove("push-right");
    }
  }, [show, isMobile]);



  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
            className="d-md-block" // forza la visibilità anche sopra md
          />

          {/* Parte destra: icona utente + logout (sempre visibile) */}
          <div className="d-none d-md-flex align-items-center ms-auto">
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
         placement={isMobile ? "top" : "start"}  // TOP su mobile, START su desktop
        show={show}
        onHide={() => setShow(false)}
        backdrop={false}
        scroll={true}
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
            <Nav.Link onClick={() => handleNavigate("/me")}>
              My Profile
            </Nav.Link>
             <Nav.Link onClick={() => handleNavigate("/users")}>
             Users List
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
        {/* SOLO MOBILE: user + logout nella tendina */}
        <div className="d-md-none mt-4 border-top pt-3">
          {user && (
            <div
              className="d-flex align-items-center mb-3"
              style={{ cursor: "pointer" }}
              onClick={() => handleNavigate("/me")}
            >
              <BsPersonCircle size={24} className="me-2" />
              <span>
                {user.name} {user.surname}
              </span>
            </div>
          )}

          <Button
            variant="outline-danger"
            className="w-100 d-flex align-items-center justify-content-center"
            onClick={handleLogout}
          >
            <BsBoxArrowRight size={20} className="me-2" />
            Logout
          </Button>
        </div>
      </Offcanvas>
    </>
  );
};
export default AppNavbar;
