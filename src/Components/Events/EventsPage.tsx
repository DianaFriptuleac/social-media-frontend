import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Pagination,
  Row,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import EventFormModal from "./EventFormModal";
import { useGetAllEventsQuery } from "../../api/EventApi";
import { getPaginationRange } from "../../utils/pagination";


const EventsPage = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [showCreate, setShowCreate] = useState(false);

  const { data, isLoading, isError, refetch } = useGetAllEventsQuery({
    page,
    size: 6,
  });

  return (
    <Container className="mt-4">
      <Row className="mb-3 align-items-center">
        <Col>
          <h2>Events</h2>
        </Col>
        <Col xs="auto">
          <Button onClick={() => setShowCreate(true)}>Create event</Button>
        </Col>
      </Row>

      {isLoading && (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      )}

      {isError && (
        <Alert variant="danger">
          Error loading events.{" "}
          <Button variant="link" onClick={() => refetch()}>
            Retry
          </Button>
        </Alert>
      )}

      {!isLoading && data?.content.length === 0 && (
        <Alert variant="light">No events found.</Alert>
      )}

      <Row>
        {data?.content.map((event) => (
          <Col xs={12} md={6} lg={4} key={event.id} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <Card.Title>{event.name}</Card.Title>
                <Card.Text className="mb-1">
                  <strong>Location:</strong> {event.location || "-"}
                </Card.Text>
                <Card.Text className="mb-1">
                  <strong>Type:</strong> {event.type}
                </Card.Text>
                <Card.Text className="mb-1">
                  <strong>Audience:</strong> {event.audienceType}
                </Card.Text>
                <Card.Text className="mb-1">
                  <strong>Start:</strong>{" "}
                  {new Date(event.startAt).toLocaleString()}
                </Card.Text>
                <Card.Text className="mb-1">
                  <strong>Created by:</strong> {event.createdByName}
                </Card.Text>
                <Card.Text className="mb-1">
                  <strong>Total invited:</strong> {event.totalInvited}
                </Card.Text>
                <Card.Text className="mb-1">
                  <strong>Accepted:</strong> {event.acceptedCount}
                </Card.Text>
                <Card.Text className="mb-1">
                  <strong>Declined:</strong> {event.declinedCount}
                </Card.Text>
                <Card.Text className="mb-3">
                  <strong>Pending:</strong> {event.pendingCount}
                </Card.Text>

                <div className="mt-auto">
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    Open details
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {!!data && data.totalPages > 1 && (
        <Pagination className="justify-content-center mt-3">
          <Pagination.Prev
            disabled={page === 0}
            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
          />
          {getPaginationRange(page, data.totalPages).map((p) => (
            <Pagination.Item
              key={p}
              active={p === page}
              onClick={() => setPage(p)}
            >
              {p + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={page >= data.totalPages - 1}
            onClick={() =>
              setPage((prev) => Math.min(data.totalPages - 1, prev + 1))
            }
          />
        </Pagination>
      )}

      <EventFormModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        mode="create"
      />
    </Container>
  );
};

export default EventsPage;
