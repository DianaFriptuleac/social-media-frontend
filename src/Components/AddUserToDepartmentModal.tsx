import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Form,
  ListGroup,
  Modal,
  Spinner,
} from "react-bootstrap";
import { useGetAllUsersQuery } from "../api/userApi";
import { useAssignRolesMutation } from "../api/departmentApi";
import type { UserListItem } from "../types/profile";
import RolePicker from "./RolePicker";

interface AddUserToDepartmentModalProps {
  show: boolean;
  onHide: () => void;
  departmentId: string;
  existingUserIds: string[]; // per bloccare chi è già dentro
};

const DEFAULT_AVAILABLE_ROLES = ["MANAGER", "EMPLOYEE", "HR", "IT"];

const normalizeRole = (role: string) =>
  role.trim().toUpperCase().replace(/\s+/g, "_");

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

const AddUserToDepartmentModal = ({
  show,
  onHide,
  departmentId,
  existingUserIds,
}: AddUserToDepartmentModalProps) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 250);

  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["EMPLOYEE"]);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // carico un blocco di utenti
  const { data, isFetching, isError } = useGetAllUsersQuery(
    { page: 0, size: 200 },
    { skip: !show }
  );

  const allUsers = data?.content ?? [];
  const canSearch = debouncedQuery.trim().length >= 2;

  const results = useMemo(() => {
    if (!canSearch) return [];
    const q = debouncedQuery.trim().toLowerCase();
    return allUsers
      .filter((u) => {
        const hay =
          `${u.name} ${u.surname} ${u.email} ${u.username}`.toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 25);
  }, [allUsers, canSearch, debouncedQuery]);

  const [assignRoles, { isLoading: isSaving }] = useAssignRolesMutation();

  const resetModal = () => {
    setQuery("");
    setSelectedUser(null);
    setSelectedRoles(["EMPLOYEE"]);
    setAlertMsg(null);
    setShowConfirm(false);
  };

  useEffect(() => {
    if (show) resetModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const toggleRole = (roleRaw: string) => {
    const role = normalizeRole(roleRaw);
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const addRole = (roleRaw: string) => {
    const role = normalizeRole(roleRaw);
    if (!role) return;
    setSelectedRoles((prev) => (prev.includes(role) ? prev : [...prev, role]));
  };

  const handleContinue = () => {
    setAlertMsg(null);

    if (!selectedUser) {
      setAlertMsg("Select user.");
      return;
    }
    if (existingUserIds.includes(selectedUser.id)) {
      setAlertMsg("This user is already present in the department.");
      return;
    }
    if (selectedRoles.length === 0) {
      setAlertMsg("Please select at least one role.");
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (!selectedUser) return;

    try {
      await assignRoles({
        userId: selectedUser.id,
        departmentId,
        roles: selectedRoles,
      }).unwrap();

      // chiudi e reset
      onHide();
      resetModal();
    } catch (err: any) {
      const message =
        typeof err?.data?.message === "string"
          ? err.data.message
          : "Error while assigning roles";
      setAlertMsg(message);
    }
  };

  const handleClose = () => {
    onHide();
    resetModal();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add user to department</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {alertMsg && <Alert variant="warning">{alertMsg}</Alert>}
        {isError && <Alert variant="danger">Error loading users.</Alert>}

        {!showConfirm ? (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Cerca utente</Form.Label>
              <Form.Control
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, Surname"
                autoFocus
              />
              <Form.Text className="text-muted">
                Minimum 2 characters.
              </Form.Text>
            </Form.Group>

            <div className="d-flex gap-4">
              {/* risultati */}
              <div style={{ flex: 1 }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong>Results</strong>
                  {isFetching && <Spinner animation="border" size="sm" />}
                </div>

                <ListGroup style={{ maxHeight: 280, overflowY: "auto" }}>
                  {!canSearch && (
                    <ListGroup.Item className="text-muted">
                      Start typing to search…
                    </ListGroup.Item>
                  )}

                  {canSearch && !isFetching && results.length === 0 && (
                    <ListGroup.Item className="text-muted">
                      No users found.
                    </ListGroup.Item>
                  )}

                  {results.map((u) => {
                    const active = selectedUser?.id === u.id;
                    const already = existingUserIds.includes(u.id);
                    return (
                      <ListGroup.Item
                        key={u.id}
                        action
                        active={active}
                        disabled={already}
                        onClick={() => !already && setSelectedUser(u)}
                        className="d-flex justify-content-between align-items-start"
                      >
                        <div>
                          <div className="fw-bold">
                            {u.surname} {u.name}
                          </div>
                          <div className="small">{u.email}</div>
                          <div className="small text-muted">{u.username}</div>
                        </div>
                        {already ? (
                          <Badge bg="secondary">Already exist</Badge>
                        ) : active ? (
                          <Badge bg="light" text="dark">
                            Selected
                          </Badge>
                        ) : null}
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </div>

              {/* ruoli */}
              <div style={{ width: 280 }}>
                <RolePicker
                  title="Roles in the department"
                  availableRoles={DEFAULT_AVAILABLE_ROLES}
                  selectedRoles={selectedRoles}
                  onToggle={(role) => toggleRole(role)}
                  onAddCustom={(role) => addRole(role)}
                />
              </div>
            </div>
          </>
        ) : (
          <Alert variant="warning">
            <Alert.Heading>Do you confirm?</Alert.Heading>
            <p className="mb-2">
              Add{" "}
              <strong>
                {selectedUser?.surname} {selectedUser?.name}
              </strong>{" "}
              to the department with:
            </p>
            <div className="d-flex flex-wrap gap-1">
              {selectedRoles.map((r) => (
                <Badge key={r} bg="primary">
                  {r}
                </Badge>
              ))}
            </div>
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer>
        {!showConfirm ? (
          <>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleContinue}
              disabled={!selectedUser}
            >
              Continue
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={() => setShowConfirm(false)}>
              No, go back
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Yes, add user"}
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default AddUserToDepartmentModal;
