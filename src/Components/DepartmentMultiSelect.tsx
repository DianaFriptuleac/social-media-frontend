import { useMemo, useState } from "react";
import { Badge, Form, ListGroup } from "react-bootstrap";

interface DepartmentListItem {
  id: string;
  name: string;
}

interface Props {
  departments: DepartmentListItem[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

const DepartmentMultiSelect = ({
  departments,
  selectedIds,
  onChange,
}: Props) => {
  const [query, setQuery] = useState("");

  const filteredDepartments = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return departments.slice(0, 20);

    return departments
      .filter((d) => d.name.toLowerCase().includes(q))
      .slice(0, 25);
  }, [departments, query]);

  const toggleDepartment = (departmentId: string) => {
    if (selectedIds.includes(departmentId)) {
      onChange(selectedIds.filter((id) => id !== departmentId));
    } else {
      onChange([...selectedIds, departmentId]);
    }
  };

  const selectedDepartments = departments.filter((d) =>
    selectedIds.includes(d.id),
  );

  return (
    <div className="app-modal__section">
      <div className="app-modal__section-title">Departments</div>
      <Form.Control
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search department..."
      />

      <div className="mb-2 d-flex flex-wrap gap-2">
        {selectedDepartments.map((d) => (
          <Badge
            key={d.id}
            bg="info"
            style={{ cursor: "pointer" }}
            onClick={() => toggleDepartment(d.id)}
          >
            {d.name} ×
          </Badge>
        ))}
      </div>

      <ListGroup className="mt-3" style={{ maxHeight: 220, overflowY: "auto" }}>
        {filteredDepartments.map((d) => {
          const active = selectedIds.includes(d.id);
          return (
            <ListGroup.Item
              key={d.id}
              action
              active={active}
              onClick={() => toggleDepartment(d.id)}
              className="d-flex justify-content-between align-items-center"
            >
              <span>{d.name}</span>
              {active && (
                <Badge bg="light" text="dark">
                  Selected
                </Badge>
              )}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>
  );
};

export default DepartmentMultiSelect;
