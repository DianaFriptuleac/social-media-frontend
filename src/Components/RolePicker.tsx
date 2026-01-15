import React, { useState } from "react";
import { Badge, Button, Form, ListGroup } from "react-bootstrap";
import type { RolePickerProps } from "../types/departments";

const normalizeRole = (role: string) =>
  role.trim().toUpperCase().replace(/\s+/g, "_");



const RolePicker: React.FC<RolePickerProps> = ({
  title = "Select roles",
  availableRoles,
  selectedRoles,
  disabledRoles = [],
  onToggle,
  onAddCustom,
}) => {
  const [customRole, setCustomRole] = useState("");

  const disabledSet = new Set(disabledRoles.map(normalizeRole));

  const addCustom = () => {
    const role = normalizeRole(customRole);
    if (!role) return;
    onAddCustom(role);
    setCustomRole("");
  };

  return (
    <>
      <p className="mb-2">{title}:</p>

      <ListGroup className="mb-3">
        {availableRoles.map((r) => {
          const role = normalizeRole(r);
          const already = disabledSet.has(role);
          const active = selectedRoles.includes(role);

          return (
            <ListGroup.Item
              key={role}
              action
              disabled={already}
              active={active}
              onClick={() => onToggle(role)}
              style={{ cursor: already ? "not-allowed" : "pointer" }}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <Badge bg="info" text="dark" className="me-2">
                  {role}
                </Badge>
              </div>
              {already && <Badge bg="secondary">Already exist</Badge>}
            </ListGroup.Item>
          );
        })}
      </ListGroup>

      {/* Custom role */}
      <Form.Group className="mb-2">
        <Form.Label className="small">Add role manually</Form.Label>
        <div className="d-flex gap-2">
          <Form.Control
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
            placeholder="es. QA_LEAD"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
          />
          <Button
            variant="outline-primary"
            onClick={addCustom}
            disabled={!customRole.trim()}
          >
            Add
          </Button>
        </div>
      </Form.Group>

      {/* Selected */}
      {selectedRoles.length > 0 && (
        <div className="mt-3">
          <div className="small mb-2">Selected roles (click to remove):</div>
          <div className="d-flex flex-wrap gap-1">
            {selectedRoles.map((r) => (
              <Badge
                key={r}
                bg="primary"
                style={{ cursor: "pointer" }}
                onClick={() => onToggle(r)}
                title="Remove from selection"
              >
                {r} ✕
              </Badge>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default RolePicker;
