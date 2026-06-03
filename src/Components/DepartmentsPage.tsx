import React, { useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Pagination,
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
import { FiTrash2, FiUserPlus, FiSettings } from "react-icons/fi";
import "../css/Departments.css";

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
    <Container className="dept-page">
      <Row className="dept-shell">
        {/* COLSINISTRA – LISTA DEPARTMENTS */}
        <Col md={4}>
          <Card className="dept-card">
            <Card.Header className="dept-card-header">
              <span>Departments</span>

              {isAdmin && (
                <Button
                  className="dept-btn-primary"
                  onClick={() => setShowCreateDept(true)}
                >
                  Add New
                </Button>
              )}
            </Card.Header>
            <Card.Body className="dept-list">
              {loadingDepartments && <p>Loading...</p>}

              {!loadingDepartments && departments?.length === 0 && (
                <p>No departments found</p>
              )}

              {departments?.map((dept) => (
                <Card
                  key={dept.id}
                  className={`mb-2 dept-item ${
                    dept.id === selectedDepartmentId
                      ? "dept-item--selected"
                      : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => dispatch(setSelectedDepartment(dept.id))}
                >
                  <Card.Body>
                    <h6 className="dept-item-name">{dept.name}</h6>
                    <p className="dept-item-desc">{dept.description}</p>
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
          <Card className="dept-card">
            <Card.Header className="dept-card-header">
              Department Detail
            </Card.Header>
            <Card.Body>
              {!selectedDepartmentId && (
                <p className="dept-empty">Select a department...</p>
              )}

              {selectedDepartmentId && loadingDepartment && (
                <p>Loading data...</p>
              )}

              {selectedDepartment && (
                <>
                  <div className="dept-detail-hero">
                    <div className="dept-hero-left">
                      <h2 className="dept-detail-name">
                        {selectedDepartment.name}
                      </h2>

                      <p className="dept-detail-desc">
                        {selectedDepartment.description ||
                          "No description available."}
                      </p>
                    </div>

                    <div className="dept-metrics">
                      <div className="dept-metric">
                        <span className="dept-metric__value">
                          {selectedDepartment.userCount}
                        </span>
                        <span className="dept-metric__label">Active Depts</span>
                      </div>

                      <div className="dept-metric dept-metric--primary">
                        <span className="dept-metric__value">
                          {selectedDepartment.users.length}
                        </span>
                        <span className="dept-metric__label">
                          Total Members
                        </span>
                      </div>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="dept-actions">
                      <Button
                        variant="secondary"
                        className="dept-btn-icon dept-btn-icon--secondary"
                        disabled={!selectedDepartment}
                        onClick={() => setShowEditDepartment(true)}
                      >
                        <FiSettings />
                      </Button>
                      <Button
                        variant="primary"
                        className="dept-btn-icon dept-btn-icon--primary"
                        disabled={!selectedDepartmentId}
                        onClick={() => setShowAddUserModal(true)}
                      >
                        <FiUserPlus />
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
                  <div className="dept-table-panel">
                    <Table className="dept-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          {isAdmin && (
                            <th className="dept-col-actions">Actions</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {pagedUsers.length === 0 && (
                          <tr>
                            <td
                              colSpan={isAdmin ? 4 : 3}
                              className="dept-table-empty-cell"
                            >
                              No users found
                            </td>
                          </tr>
                        )}

                        {pagedUsers.map((u) => (
                          <tr key={u.id}>
                            <td className="dept-cell-name">
                              <div className="dept-user-cell">
                                <div className="dept-user-avatar">
                                  {u.name?.[0] || ""} {u.surname?.[0] || ""}
                                </div>
                                <div className="dept-user-meta">
                                  <div className="dept-user-name">
                                    {u.name} {u.surname}
                                  </div>
                                  <div className="dept-user-sub">
                                    Team member
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="dept-cell-email">
                              <span className="dept-user-email">{u.email}</span>
                            </td>

                            <td className="dept-cell-role">
                              <div className="dept-role-list">
                                {u.roles.map((role) => (
                                  <span className="dept-role-pill" key={role}>
                                    {role}
                                  </span>
                                ))}
                              </div>
                            </td>

                            {isAdmin && (
                              <td className="dept-cell-actions">
                               
                                  <div className="dept-icon-actions d-flex justify-content-between">
                                    <DepartmentRolesModal
                                      userId={u.id}
                                      departmentId={selectedDepartmentId!}
                                      currentRoles={u.roles}
                                      canEdit={isAdmin}
                                    />

                                    <Button
                                      className="dept-btn-icon dept-btn-icon--danger"
                                      onClick={() => {
                                        if (!selectedDepartmentId) return;
                                        removeUserFromDepartment({
                                          departmentId: selectedDepartmentId,
                                          userId: u.id,
                                        });
                                      }}
                                    >
                                      <FiTrash2 />
                                    </Button>
                                  </div>
                              
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>

                  {/* PAGINATION */}
                  {selectedDepartment.users.length > pageSize && (
                    <Pagination className="dept-pagination">
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
