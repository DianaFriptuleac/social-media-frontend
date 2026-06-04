import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { useState } from "react";
import {
  useDeleteEventMutation,
  useGetEventByIdQuery,
  useUpdateParticipationMutation,
} from "../../api/EventApi";
import {
  Alert,
  Button,
  Container,
  Spinner,
  Row,
  Col,
  Card,
  Badge,
  ListGroup,
} from "react-bootstrap";
import EventFormModal from "./EventFormModal";
import EventMap from "./EventMap";
import "../../css/Events.css";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [showEdit, setShowEdit] = useState(false);

  const { data, isLoading, isError, refetch } = useGetEventByIdQuery(id!, {
    skip: !id,
  });
  const [updateParticipation, { isLoading: participationLoading }] =
    useUpdateParticipationMutation();
  const [deleteEvent, { isLoading: deleting }] = useDeleteEventMutation();

  if (isLoading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }
  if (isError || !data) {
    return (
      <Container className="event-detail-page">
        <Alert variant="danger">
          Error loading event.
          <Button variant="link" onClick={() => refetch()}>
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }
  const isCreator = currentUser?.id === data.createdBy;
  const myParticipant = data.participants.find(
    (p) => p.userId === currentUser?.id,
  );
  const handleParticipation = async (status: "ACCEPTED" | "DECLINED") => {
    try {
      await updateParticipation({
        eventId: data.id,
        body: { status },
      }).unwrap();
    } catch (err) {
      console.error(err);
      alert("Error updating participantion");
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm("Do you really want to delete this event?");
    if (!ok) return;

    try {
      await deleteEvent({ eventId: data.id }).unwrap();
      navigate("/events");
    } catch (err) {
      console.error(err);
      alert("Error deleting event");
    }
  };
  return (
    <Container className="event-detail-page">
  <Card className="event-card event-hero-card mb-4">
  <Card.Body>
    <div className="event-hero-top">
      <div>
        <span className="event-kicker">{data.type}</span>

        <h2 className="event-detail-title">{data.name}</h2>

        <p className="event-hero-sub">
          {data.location || "No location"} •{" "}
          {new Date(data.startAt).toLocaleString("it-IT", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {isCreator && (
        <div className="event-hero-actions">
          <Button variant="outline-primary" onClick={() => setShowEdit(true)}>
            Edit
          </Button>

          <Button
            variant="outline-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      )}
    </div>

    <div className="event-stats-inline">
      <div className="event-stat event-stat--total">
        <span className="event-stat-label">Total</span>
        <span className="event-stat-value">{data.totalInvited}</span>
      </div>

      <div className="event-stat event-stat--accepted">
        <span className="event-stat-label">Accepted</span>
        <span className="event-stat-value">{data.acceptedCount}</span>
      </div>

      <div className="event-stat event-stat--declined">
        <span className="event-stat-label">Declined</span>
        <span className="event-stat-value">{data.declinedCount}</span>
      </div>

      <div className="event-stat event-stat--pending">
        <span className="event-stat-label">Pending</span>
        <span className="event-stat-value">{data.pendingCount}</span>
      </div>
    </div>
  </Card.Body>
</Card>

      <Row className="align-items-stretch g-4 mb-4">
        <Col md={8} className="d-flex">
          <Card className="event-card flex-fill">
            <Card.Body>
              <p>
                <strong>Description:</strong> {data.description || "-"}
              </p>
              <p>
                <strong>Location:</strong> {data.location || "-"}
              </p>
              <p>
                <strong>Type:</strong> {data.type}
              </p>
              <p>
                <strong>Audience:</strong> {data.audienceType}
              </p>
              <p>
                <strong>Start:</strong>{" "}
                {new Date(data.startAt).toLocaleString("it-IT", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <p>
                <strong>End:</strong>{" "}
                {new Date(data.endAt).toLocaleString("it-IT", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>
                <strong>Created by:</strong> {data.createdByName}
              </p>

              <div className="mb-2">
                <strong>Departments:</strong>{" "}
                {data.departments.length > 0
                  ? data.departments.map((d) => d.name).join(", ")
                  : "-"}
              </div>

              {myParticipant && (
                <div className="mt-4">
                  <p>
                    <strong>My status:</strong>{" "}
                    <Badge bg="secondary">{myParticipant.status}</Badge>
                  </p>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      onClick={() => handleParticipation("ACCEPTED")}
                      disabled={participationLoading}
                    >
                      Participate
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => handleParticipation("DECLINED")}
                      disabled={participationLoading}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="d-flex">
          <Card className="event-card event-map-card flex-fill">
            <Card.Body>
              <div className="d-flex justify-content-between">
              <div>
                <h5 className="event-section-title">Location</h5>
              </div>
              <div>
                <p className="event-muted mb-3">{data.location || "-"}</p>
              </div>
              </div>
              <EventMap location={data.location} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="event-card">
        <Card.Body>
          <h4>Participants</h4>
          <ListGroup variant="flush">
            {data.participants.map((p) => (
              <ListGroup.Item
                key={p.userId}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <div>
                    <strong>
                      {p.name} {p.surname}
                    </strong>
                  </div>
                  <div>{p.email}</div>
                </div>
                <Badge bg="secondary">{p.status}</Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>

      <EventFormModal
        show={showEdit}
        onHide={() => setShowEdit(false)}
        mode="edit"
        eventData={data}
      />
    </Container>
  );
};

export default EventDetailPage;
