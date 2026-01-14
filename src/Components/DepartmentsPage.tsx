// src/Components/DepartmentsPage.tsx
import React, { useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Pagination,
  Badge,
} from "react-bootstrap";

import {
  useGetDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useRemoveUserFromDepartmentMutation,
} from "../api/department";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setSelectedDepartment, setPage } from "../store/departmentSlice";

const DepartmentsPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const { selectedDepartmentId, page, pageSize } = useAppSelector(
    (state) => state.departmentUI
  );

  const [removeUserFromDepartment] = useRemoveUserFromDepartmentMutation();

  // info utente (x btn admin)
  const isAdmin = useAppSelector(
    (state) => state.auth.user?.role === "ADMIN"
  );

  // QUERY LISTA
  const { data: departments, isLoading: loadingDepartments } =
    useGetDepartmentsQuery();

  // QUERY DETTAGLIO
  const { data: selectedDepartment, isLoading: loadingDepartment } =
    useGetDepartmentByIdQuery(selectedDepartmentId!, {
      skip: !selectedDepartmentId,
    });

  // PAGINATION
  const pagedUsers = useMemo(() => {
    if (!selectedDepartment) return [];
    const start = (page - 1) * pageSize;
    return selectedDepartment.users.slice(start, start + pageSize);
  }, [selectedDepartment, page, pageSize]);

  const totalPages = selectedDepartment
    ? Math.ceil(selectedDepartment.users.length / pageSize)
    : 1;

  return (
    <Container className="py-4">
      <Row>
        {/* COLSINISTRA – LISTA DEPARTMENTS */}
        <Col md={4}>
          <Card>
            <Card.Header className="fw-bold">Departments</Card.Header>
            <Card.Body style={{ maxHeight: "80vh", overflowY: "auto" }}>
              {loadingDepartments && <p>Caricamento...</p>}

              {!loadingDepartments && departments?.length === 0 && (
                <p>Nessun department trovato</p>
              )}

              {departments?.map((dept) => (
                <Card
                  key={dept.id}
                  className={`mb-2 ${
                    dept.id === selectedDepartmentId ? "border-primary" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => dispatch(setSelectedDepartment(dept.id))}
                >
                  <Card.Body>
                    <h6 className="fw-bold mb-1">{dept.name}</h6>
                    <p className="text-muted small mb-0">{dept.description}</p>
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* COL DESTRA – DETTAGLIO */}
        <Col md={8}>
          <Card>
            <Card.Header className="fw-bold">Dettaglio Department</Card.Header>
            <Card.Body>
              {!selectedDepartmentId && <p>Seleziona un department...</p>}

              {selectedDepartmentId && loadingDepartment && (
                <p>Caricamento dati...</p>
              )}

              {selectedDepartment && (
                <>
                  <h4>{selectedDepartment.name}</h4>
                  <p>{selectedDepartment.description}</p>

                  <p>
                    <strong>Nr. utenti:</strong>{" "}
                    <Badge bg="secondary">{selectedDepartment.userCount}</Badge>
                  </p>

                  {isAdmin && (
                    <div className="mb-3 d-flex gap-2">
                      <Button variant="secondary">Modifica department</Button>
                      <Button variant="primary">Aggiungi utente</Button>
                    </div>
                  )}

                  {/* TAB. UTENTI */}
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Ruoli</th>
                        {isAdmin && <th>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {pagedUsers.length === 0 && (
                        <tr>
                          <td colSpan={isAdmin ? 4 : 3} className="text-center">
                            Nessun utente presente
                          </td>
                        </tr>
                      )}

                      {pagedUsers.map((u) => (
                        <tr key={u.id}>
                          <td>
                            {u.name} {u.surname}
                          </td>
                          <td>{u.email}</td>
                          <td>
                            {u.roles.map((role) => (
                              <Badge
                                bg="info"
                                text="dark"
                                className="me-1"
                                key={role}
                              >
                                {role}
                              </Badge>
                            ))}
                          </td>

                          {isAdmin && (
                            <td>
                              <Button
                                variant="warning"
                                size="sm"
                                className="me-2"
                              >
                                Modifica Ruoli
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                  if (!selectedDepartmentId) return;
                                  removeUserFromDepartment({
                                    departmentId: selectedDepartmentId,
                                    userId: u.id,
                                  });
                                }}
                              >
                                Rimuovi
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  {/* PAGINATION */}
                  {selectedDepartment.users.length > pageSize && (
                    <Pagination>
                      <Pagination.Prev
                        disabled={page === 1}
                        onClick={() => dispatch(setPage(page - 1))}
                      />
                      {[...Array(totalPages)].map((_, i) => (
                        <Pagination.Item
                          key={i}
                          active={page === i + 1}
                          onClick={() => dispatch(setPage(i + 1))}
                        >
                          {i + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next
                        disabled={page === totalPages}
                        onClick={() => dispatch(setPage(page + 1))}
                      />
                    </Pagination>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DepartmentsPage;
