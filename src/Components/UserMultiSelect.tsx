import { useMemo, useState } from "react";
import { Badge, Form, ListGroup } from "react-bootstrap";
import type { UserListItem } from "../types/profile";


interface Props {
  users: UserListItem[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

const UserMultiSelect = ({ users, selectedIds, onChange }: Props) => {
  const [query, setQuery] = useState("");

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users.slice(0, 20);

    return users
      .filter((u) => {
        const haystack =
          `${u.name} ${u.surname} ${u.email} ${u.username}`.toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 25);
  }, [users, query]);

  const toggleUser = (userId: string) => {
    if (selectedIds.includes(userId)) {
      onChange(selectedIds.filter((id) => id !== userId));
    } else {
      onChange([...selectedIds, userId]);
    }
  };

  const selectedUsers = users.filter((u) => selectedIds.includes(u.id));

  return (
    <div>
      <Form.Group className="mb-2">
        <Form.Label>Users</Form.Label>
        <Form.Control
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search user by name, surname, email..."
        />
      </Form.Group>

      <div className="mb-2 d-flex flex-wrap gap-2">
        {selectedUsers.map((u) => (
          <Badge
            key={u.id}
            bg="primary"
            style={{ cursor: "pointer" }}
            onClick={() => toggleUser(u.id)}
          >
            {u.name} {u.surname} ×
          </Badge>
        ))}
      </div>

      <ListGroup style={{ maxHeight: 220, overflowY: "auto" }}>
        {filteredUsers.map((u) => {
          const active = selectedIds.includes(u.id);
          return (
            <ListGroup.Item
              key={u.id}
              action
              active={active}
              onClick={() => toggleUser(u.id)}
              className="d-flex justify-content-between align-items-start"
            >
              <div>
                <div className="fw-bold">
                  {u.surname} {u.name}
                </div>
                <div className="small">{u.email}</div>
                <div className="small text-muted">{u.username}</div>
              </div>

              {active && <Badge bg="light" text="dark">Selected</Badge>}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>
  );
};

export default UserMultiSelect;