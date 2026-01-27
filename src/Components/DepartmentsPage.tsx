import React, { useMemo, useState } from "react";
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
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} from "../api/departmentApi";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setSelectedDepartment, setPage } from "../store/departmentSlice";
import DepartmentRolesModal from "./DepartmentRolesModal";
import AddUserToDepartmentModal from "./AddUserToDepartmentModal";
import { isFetchBaseQueryError } from "../utils/rtkQuery";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import CreateDepartmentModal from "./CreateDepartmentModal";
import EditDepartmentModal from "./EditDepartmentModal";

const DepartmentsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const { selectedDepartmentId, page, pageSize } = useAppSelector(
    (state) => state.departmentUI,
  );

  const [removeUserFromDepartment] = useRemoveUserFromDepartmentMutation();

  // info utente (x btn admin)
  const isAdmin = useAppSelector((state) => state.auth.user?.role === "ADMIN");

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

  // crate new department
  const [showCreateDept, setShowCreateDept] = useState(false);
  const [
    createDepartment,
    { isLoading: isCreatingDept, error: createDeptError },
  ] = useCreateDepartmentMutation();

  const createDeptErrorMsg = useMemo(() => {
    if (!createDeptError) return null;

    if (
      isFetchBaseQueryError(createDeptError) &&
      createDeptError.status === 403
    ) {
      const maybe = (createDeptError as FetchBaseQueryError).data as any;
      return maybe?.msg ?? "Administrator only.";
    }
    return "Error creating department.";
  }, [createDeptError]);

  // Mostra edit department modal
  const [showEditDepartment, setShowEditDepartment] = useState(false);
  const [
    updateDepartment,
    { isLoading: isUpdatingDepartment, error: updateDepartmentError },
  ] = useUpdateDepartmentMutation();

  const [
    deleteDepartment,
    { isLoading: isDeletingDepartment, error: deleteDepartmentError },
  ] = useDeleteDepartmentMutation();

  const editDepErrorMsg = useMemo(() => {
    const error = updateDepartmentError ?? deleteDepartmentError;
    if (!error) return null;

    if (isFetchBaseQueryError(error) && error.status === 403) {
      const maybe = (error as FetchBaseQueryError).data as any;
      return maybe?.msg ?? "Administrator only.";
    }
    return "Operation failed";
  }, [updateDepartmentError, deleteDepartmentError]);

  return (
    <Container className="py-4">
      <Row>
        {/* COLSINISTRA – LISTA DEPARTMENTS */}
        <Col md={4}>
          <Card>
            <Card.Header className="fw-bold d-flex justify-content-between align-items-center">
              <span>Departments</span>

              {isAdmin && (
                <Button size="sm" onClick={() => setShowCreateDept(true)}>
                  Add New
                </Button>
              )}
            </Card.Header>
            <Card.Body style={{ maxHeight: "80vh", overflowY: "auto" }}>
              {loadingDepartments && <p>Loading...</p>}

              {!loadingDepartments && departments?.length === 0 && (
                <p>No departments found</p>
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
          {isAdmin && (
            <CreateDepartmentModal
              show={showCreateDept}
              onHide={() => setShowCreateDept(false)}
              isLoading={isCreatingDept}
              errorMsg={createDeptErrorMsg}
              onCreate={async (payload) => {
                try {
                  await createDepartment(payload).unwrap();
                  setShowCreateDept(false);
                } catch {}
              }}
            />
          )}
        </Col>

        {/* COL DESTRA – DETTAGLIO */}
        <Col md={8}>
          <Card>
            <Card.Header className="fw-bold">Department Detail</Card.Header>
            <Card.Body>
              {!selectedDepartmentId && <p>Select a department...</p>}

              {selectedDepartmentId && loadingDepartment && (
                <p>Loading data...</p>
              )}

              {selectedDepartment && (
                <>
                  <h4>{selectedDepartment.name}</h4>
                  <p>{selectedDepartment.description}</p>

                  <p>
                    <strong>Users number:</strong>{" "}
                    <Badge bg="secondary">{selectedDepartment.userCount}</Badge>
                  </p>

                  {isAdmin && (
                    <div className="mb-3 d-flex gap-2">
                      <Button
                        variant="secondary"
                        disabled={!selectedDepartment}
                        onClick={() => setShowEditDepartment(true)}
                      >
                        Edit department
                      </Button>
                      <Button
                        variant="primary"
                        disabled={!selectedDepartmentId}
                        onClick={() => setShowAddUserModal(true)}
                      >
                        Add user
                      </Button>
                    </div>
                  )}
                  <AddUserToDepartmentModal
                    show={showAddUserModal}
                    onHide={() => setShowAddUserModal(false)}
                    departmentId={selectedDepartmentId!}
                    existingUserIds={selectedDepartment.users.map((u) => u.id)}
                  />
                  {isAdmin && selectedDepartment && (
                    <EditDepartmentModal
                      show={showEditDepartment}
                      onHide={() => setShowEditDepartment(false)}
                      department={selectedDepartment}
                      isSaving={isUpdatingDepartment}
                      isDeleting={isDeletingDepartment}
                      errorMsg={editDepErrorMsg}
                      onSave={async (payload) => {
                        try {
                          await updateDepartment(payload).unwrap();
                          setShowEditDepartment(false);
                        } catch {}
                      }}
                      onDelete={async (id) => {
                        try {
                          await deleteDepartment(id).unwrap();
                          setShowEditDepartment(false);
                          dispatch(setSelectedDepartment(null));
                        } catch {}
                      }}
                    />
                  )}

                  {/* TAB. UTENTI */}
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        {isAdmin && <th>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {pagedUsers.length === 0 && (
                        <tr>
                          <td colSpan={isAdmin ? 4 : 3} className="text-center">
                            No users found
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
                              <span className="me-2">
                                <DepartmentRolesModal
                                  userId={u.id}
                                  departmentId={selectedDepartmentId!}
                                  currentRoles={u.roles}
                                  canEdit={isAdmin}
                                />
                              </span>
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
                                Remove
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
