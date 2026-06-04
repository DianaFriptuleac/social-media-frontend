import { useEffect, useState } from "react";
import {
  type EventType,
  type EventDetail,
  type EventAudienceType,
} from "../../types/events";
import {
  useCreateEventMutation,
  useUpdateEventMutation,
} from "../../api/EventApi";
import { Modal, Form, Button } from "react-bootstrap";
import { useGetDepartmentsQuery } from "../../api/departmentApi";
import { useGetAllUsersQuery } from "../../api/userApi";
import DepartmentMultiSelect from "../DepartmentMultiSelect";
import UserMultiSelect from "../UserMultiSelect";
import "../../css/Events.css";

interface Props {
  show: boolean;
  onHide: () => void;
  mode: "create" | "edit";
  eventData?: EventDetail;
}
const EventFormModal = ({ show, onHide, mode, eventData }: Props) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [type, setType] = useState<EventType>("MEETING");
  const [audienceType, setAudienceType] =
    useState<EventAudienceType>("SPECIFIC_USERS");
  const [departmentIds, setDepartmentIds] = useState<string[]>([]);
  const [userIds, setUserIds] = useState<string[]>([]);

  const { data: usersData, isFetching: loadingUsers } = useGetAllUsersQuery(
    { page: 0, size: 200 },
    { skip: !show },
  );

  const { data: departmentsData, isFetching: loadingDepartments } =
    useGetDepartmentsQuery(undefined, { skip: !show });

  const users = usersData?.content ?? [];
  const departments = departmentsData ?? [];

  const [createEvent, { isLoading: creating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: updating }] = useUpdateEventMutation();

  useEffect(() => {
    if (mode === "edit" && eventData) {
      setName(eventData.name);
      setLocation(eventData.location || "");
      setDescription(eventData.description || "");
      setStartDate(eventData.startAt.slice(0, 10));
      setStartTime(eventData.startAt.slice(11, 16));
      setEndDate(eventData.endAt.slice(0, 10));
      setEndTime(eventData.endAt.slice(11, 16));
      setType(eventData.type);
      setAudienceType(eventData.audienceType);
      setDepartmentIds(eventData.departments?.map((d) => d.id) ?? []);
      setUserIds(eventData.participants.map((p) => p.userId));
    } else {
      setName("");
      setLocation("");
      setDescription("");
      setStartDate("");
      setStartTime("");
      setEndDate("");
      setEndTime("");
      setType("MEETING");
      setAudienceType("SPECIFIC_USERS");
      setDepartmentIds([]);
      setUserIds([]);
    }
  }, [mode, eventData, show]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = {
      name,
      location,
      description,
      startAt: `${startDate}T${startTime}`,
      endAt: `${endDate}T${endTime}`,
      type,
      audienceType,
      departmentIds,
      userIds,
    };
    try {
      if (mode === "create") {
        await createEvent(body).unwrap();
      } else if (eventData) {
        await updateEvent({ eventId: eventData.id, body }).unwrap();
      }
      onHide();
    } catch (err) {
      console.error(err);
      alert("Error saving event");
    }
  };
  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="app-modal">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {mode === "create" ? "Create event" : "Edit event"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Start date</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Start time</Form.Label>
            <Form.Control
              type="text"
              placeholder="15:00"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>End date</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>End time</Form.Label>
            <Form.Control
              type="text"
              placeholder="16:00"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select
              value={type}
              onChange={(e) => setType(e.target.value as EventType)}
            >
              <option value="MEETING">MEETING</option>
              <option value="PARTY">PARTY</option>
              <option value="TRAINING">TRAINING</option>
              <option value="WORKSHOP">WORKSHOP</option>
              <option value="WEBINAR">WEBINAR</option>
              <option value="OTHER">OTHER</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Audience type</Form.Label>
            <Form.Select
              value={audienceType}
              onChange={(e) =>
                setAudienceType(e.target.value as EventAudienceType)
              }
            >
              <option value="ALL_EMPLOYEES">ALL_EMPLOYEES</option>
              <option value="DEPARTMENTS">DEPARTMENTS</option>
              <option value="SPECIFIC_USERS">SPECIFIC_USERS</option>
              <option value="MIXED">MIXED</option>
            </Form.Select>
          </Form.Group>

          {loadingUsers || loadingDepartments ? (
            <div className="text-center py-3">Loading...</div>
          ) : (
            <>
              <div className="mb-4">
                <DepartmentMultiSelect
                  departments={departments}
                  selectedIds={departmentIds}
                  onChange={setDepartmentIds}
                />
              </div>

              <div className="mb-3">
                <UserMultiSelect
                  users={users}
                  selectedIds={userIds}
                  onChange={setUserIds}
                />
              </div>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" disabled={creating || updating}>
            {creating || updating ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EventFormModal;
