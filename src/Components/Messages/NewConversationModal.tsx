import { useEffect, useMemo, useState } from "react";
import { Alert, Badge, Button, Form, ListGroup, Modal, Spinner } from "react-bootstrap";
import { useGetAllUsersQuery } from "../../api/userApi";
import { useCreateDirectConversationMutation } from "../../api/messageApi";
import type { UserListItem } from "../../types/profile";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  closeNewConversationModal,
  setSelectedConversation,
} from "../../store/messageSlice";

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);

  return debounced;
}

const NewConversationModal = () => {
  const dispatch = useAppDispatch();
  const { isNewConversationModalOpen } = useAppSelector((s) => s.message);
  const currentUser = useAppSelector((s) => s.auth.user);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 250);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data, isFetching, isError } = useGetAllUsersQuery(
    { page: 0, size: 200 },
    { skip: !isNewConversationModalOpen }
  );

  const [createDirectConversation, { isLoading: isCreating }] =
    useCreateDirectConversationMutation();

  const allUsers = data?.content ?? [];
  const canSearch = debouncedQuery.trim().length >= 2;

  const results = useMemo(() => {
    if (!canSearch) return [];

    const q = debouncedQuery.trim().toLowerCase();

    return allUsers
      .filter((u) => {
        if (u.id === currentUser?.id) return false;
        const hay = `${u.name} ${u.surname} ${u.email} ${u.username}`.toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 25);
  }, [allUsers, canSearch, debouncedQuery, currentUser?.id]);

  const handleClose = () => {
    setQuery("");
    setSelectedUser(null);
    setErrorMsg(null);
    dispatch(closeNewConversationModal());
  };

  const handleCreate = async () => {
    if (!selectedUser) {
      setErrorMsg("Select a user.");
      return;
    }

    try {
      const conversation = await createDirectConversation({
        otherUserId: selectedUser.id,
      }).unwrap();

      dispatch(setSelectedConversation(conversation.id));
      handleClose();
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Error creating conversation.");
    }
  };

  return (
    <Modal show={isNewConversationModalOpen} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>New conversation</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {errorMsg && <Alert variant="warning">{errorMsg}</Alert>}
        {isError && <Alert variant="danger">Error loading users.</Alert>}

        <Form.Group className="mb-3">
          <Form.Label>Search user</Form.Label>
          <Form.Control
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, surname, email..."
            autoFocus
          />
          <Form.Text className="text-muted">Minimum 2 characters.</Form.Text>
        </Form.Group>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <strong>Results</strong>
          {isFetching && <Spinner animation="border" size="sm" />}
        </div>

        <ListGroup style={{ maxHeight: 320, overflowY: "auto" }}>
          {!canSearch && (
            <ListGroup.Item className="text-muted">
              Start typing to search users…
            </ListGroup.Item>
          )}

          {canSearch && !isFetching && results.length === 0 && (
            <ListGroup.Item className="text-muted">No users found.</ListGroup.Item>
          )}

          {results.map((u) => {
            const active = selectedUser?.id === u.id;

            return (
              <ListGroup.Item
                key={u.id}
                action
                active={active}
                onClick={() => setSelectedUser(u)}
                className="d-flex justify-content-between align-items-start"
              >
                <div>
                  <div className="fw-bold">
                    {u.surname} {u.name}
                  </div>
                  <div className="small">{u.email}</div>
                  <div className="small text-muted">{u.username}</div>
                </div>

                {active && (
                  <Badge bg="light" text="dark">
                    Selected
                  </Badge>
                )}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleCreate} disabled={!selectedUser || isCreating}>
          {isCreating ? "Creating..." : "Create chat"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewConversationModal;