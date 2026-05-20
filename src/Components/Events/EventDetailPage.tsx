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
      <Container className="mt-4">
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
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <h2>{data.name}</h2>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          {isCreator && (
            <>
              <Button
                variant="outline-primary"
                onClick={() => setShowEdit(true)}
              >
                Edit
              </Button>
              <Button
                variant="outline-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </>
          )}
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card className="mb-4">
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

        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <h5>Stats</h5>
              <p>
                <strong>Total:</strong> {data.totalInvited}
              </p>
              <p>
                <strong>Accepted:</strong> {data.acceptedCount}
              </p>
              <p>
                <strong>Declined:</strong> {data.declinedCount}
              </p>
              <p>
                <strong>Pending:</strong> {data.pendingCount}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
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
