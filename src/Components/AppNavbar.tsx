import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useState } from "react";
import { logout } from "../store/authSlice";
import {
  Navbar,
  Container,
  Nav,
  Offcanvas,
  Button,
  Badge,
} from "react-bootstrap";
import {
  BsBell,
  BsBoxArrowRight,
  BsBuilding,
  BsCalendar,
  BsHouseDoor,
  BsInbox,
  BsList,
  BsPeople,
  BsSearch,
} from "react-icons/bs";
import "../css/Nav.css";
import { useEffect } from "react";
import { useGetMyConversationsQuery } from "../api/messageApi";
import { resetMessageState } from "../store/messageSlice";
import emptyApi from "../api/emptyApi";

const AppNavbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);

  //Stato per aprire e chiudere il menu laterale
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { data: conversations } = useGetMyConversationsQuery(undefined, {
    skip: !user,
  });
  const unreadTotal = (conversations ?? []).reduce(
    (sum, c) => sum + c.unreadCount,
    0,
  );

  const handleLogout = () => {
    dispatch(resetMessageState());
    dispatch(emptyApi.util.resetApiState());
    dispatch(logout());
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setShowMobileMenu(false); // chiudo il menu dopo il click
  };
  const isActive = (path: string) => location.pathname === path;
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Navbar
        fixed="top" // sempre in alto
        className="app-navbar"
      >
        <Container fluid className="app-navbar__inner">
          <div className="app-navbar__left">
            <button
              className="app-navbar__menu-btn d-md-none"
              onClick={() => setShowMobileMenu(true)}
              aria-label="Open menu"
            >
              <BsList size={22} />
            </button>

            <Navbar.Brand
              className="app-navbar__brand"
              onClick={() => handleNavigate("/")}
            >
              ECOMOTORS
            </Navbar.Brand>

            <Nav className="app-navbar__links d-none d-md-flex">
              <Nav.Link
                className={isActive("/") ? "active" : ""}
                onClick={() => handleNavigate("/")}
              >
                Home
              </Nav.Link>
              <Nav.Link
                className={isActive("/departments") ? "active" : ""}
                onClick={() => handleNavigate("/departments")}
              >
                Depts
              </Nav.Link>
              <Nav.Link
                className={isActive("/users") ? "active" : ""}
                onClick={() => handleNavigate("/users")}
              >
                Users
              </Nav.Link>
              <Nav.Link
                className={isActive("/messages") ? "active" : ""}
                onClick={() => handleNavigate("/messages")}
              >
                Messages{" "}
                {unreadTotal > 0 && <Badge bg="danger">{unreadTotal}</Badge>}
              </Nav.Link>
              <Nav.Link
                className={isActive("/events") ? "active" : ""}
                onClick={() => handleNavigate("/events")}
              >
                Events
              </Nav.Link>
            </Nav>
          </div>

          <div className="app-navbar__right">
            <button
              className="app-navbar__icon-btn d-none d-md-inline-flex"
              onClick={() => handleNavigate("/search")}
              aria-label="Search"
            >
              <BsSearch size={19} />
            </button>

            <button
              className="app-navbar__icon-btn"
              onClick={() => handleNavigate("/inbox")}
              aria-label="Notifications"
            >
              <BsBell size={19} />
              {unreadTotal > 0 && (
                <span className="app-navbar__dot">{unreadTotal}</span>
              )}
            </button>

            {user && (
              <div
                className="app-navbar__avatar-wrap"
                onClick={() => handleNavigate("/me")}
              >
                <img
                  className="app-navbar__avatar"
                  src={user.avatar ?? "/public/images/default-avatar.jpg"}
                  alt="avatar"
                />

                {/* <span className="nav-user-name">
                  {user.name} {user.surname}
                </span>*/}
              </div>
            )}
            <Button
              variant="link"
              className="app-navbar__logout d-none d-lg-inline-flex"
              onClick={handleLogout}
            >
              <BsBoxArrowRight size={18} />
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* Offcanvas = menu laterale (tendina da sinistra) */}
      <Offcanvas
        show={showMobileMenu}
        onHide={() => setShowMobileMenu(false)}
        placement="start"
        className="app-mobile-drawer"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <div className="app-mobile-drawer__user">
            {user && (
              <>
                <img
                  className="app-navbar__avatar"
                  src={user.avatar ?? "/images/default-avatar.jpg"}
                  alt="avatar"
                />
                <div>
                  <div className="app-mobile-drawer__name">
                    {user.name} {user.surname}
                  </div>
                  <div className="app-mobile-drawer__role">My profile</div>
                </div>
              </>
            )}
          </div>
          <Nav className="flex-column app-mobile-drawer__nav">
            <Nav.Link onClick={() => handleNavigate("/")}>Home</Nav.Link>
            <Nav.Link onClick={() => handleNavigate("/departments")}>
              Departments
            </Nav.Link>
            <Nav.Link onClick={() => handleNavigate("/users")}>Users</Nav.Link>
            <Nav.Link onClick={() => handleNavigate("/inbox")}>Inbox</Nav.Link>
            <Nav.Link onClick={() => handleNavigate("/messages")}>
              Messages{" "}
              {unreadTotal > 0 && <Badge bg="danger">{unreadTotal}</Badge>}
            </Nav.Link>
            <Nav.Link onClick={() => handleNavigate("/events")}>
              Events
            </Nav.Link>
            <Nav.Link onClick={() => handleNavigate("/me")}>
              My Profile
            </Nav.Link>
          </Nav>
          <Button className="app-mobile-drawer__logout" onClick={handleLogout}>
            <BsBoxArrowRight size={18} className="me-2" />
            Logout
          </Button>
        </Offcanvas.Body>
      </Offcanvas>
      <nav className="app-bottom-nav d-md-none">
        <button
          className={`app-bottom-nav__item ${isActive("/") ? "active" : ""}`}
          onClick={() => handleNavigate("/")}
        >
          <BsHouseDoor size={18} />
        </button>

        <button
          className={`app-bottom-nav__item ${
            isActive("/departments") ? "active" : ""
          }`}
          onClick={() => handleNavigate("/departments")}
        >
          <BsBuilding size={18} />
        </button>

        <button
          className={`app-bottom-nav__item ${isActive("/users") ? "active" : ""}`}
          onClick={() => handleNavigate("/users")}
        >
          <BsPeople size={18} />
        </button>

        <button
          className={`app-bottom-nav__item ${isActive("/inbox") ? "active" : ""}`}
          onClick={() => handleNavigate("/inbox")}
        >
          <BsInbox size={18} />
        </button>

        <button
          className={`app-bottom-nav__item ${isActive("/events") ? "active" : ""}`}
          onClick={() => handleNavigate("/events")}
        >
          <BsCalendar size={18} />
        </button>
      </nav>
    </>
  );
};
export default AppNavbar;
