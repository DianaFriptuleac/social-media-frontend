import { useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Image,
  Pagination,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import { useAppSelector } from "../store/hooks";
import { useGetAllUsersQuery } from "../api/userApi";
import UserRoleBadgeModal from "./UserRoleBadgeModal";
import { useNavigate } from "react-router-dom";
import { isFetchBaseQueryError } from "../utils/rtkQuery";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const PAGE_SIZE = 10;

const UsersListPage = () => {
  const navigate = useNavigate();

  const currentUser = useAppSelector((s) => s.auth.user);
  const isCurrentUserAdmin = currentUser?.role === "ADMIN";

  const [page, setPage] = useState(0);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetAllUsersQuery({
      page,
      size: PAGE_SIZE,
    });

  const isForbidden =
    isError && isFetchBaseQueryError(error) && error.status === 403;

  const forbiddenMsg = useMemo(() => {
    if (!isForbidden) return null;

    // legge il messaggio del BE
    const maybeData = (error as FetchBaseQueryError).data as any;
    return maybeData?.msg ?? "You don't have permission. Administrator only.";
  }, [isForbidden, error]);

  const users = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;

  const paginationItems = useMemo(() => {
    // mostra max 5 pagine
    const items: number[] = [];
    const start = Math.max(0, page - 2);
    const end = Math.min(totalPages - 1, start + 4);
    for (let p = start; p <= end; p++) items.push(p);
    return items;
  }, [page, totalPages]);

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col className="d-flex align-items-center justify-content-between">
          <h2>Users</h2>
          <div className="d-flex align-items-center gap-2">
            {isFetching && <Spinner animation="border" size="sm" />}
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => refetch()}
            >
              Refresh
            </button>
          </div>
        </Col>
      </Row>

      {/*Errore 403: Mostra solo questo e non la lista*/}
      {isForbidden ? (
        <Alert variant="warning">
          <div className="mb-2">{forbiddenMsg}</div>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </Alert>
      ) : (
        <>
          {/*Altri errori */}
          {isError && (
            <Alert variant="danger">
              Error loading users{" "}
              <button className="btn btn-link p-0" onClick={() => refetch()}>
                Retry
              </button>
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                {typeof error === "object"
                  ? JSON.stringify(error)
                  : String(error)}
              </div>
            </Alert>
          )}

          <Card>
            <Card.Body>
              {isLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                </div>
              ) : (
                <>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Avatar</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td style={{ width: 80 }}>
                            <Image
                              src={u.avatar}
                              roundedCircle
                              style={{
                                width: 42,
                                height: 42,
                                objectFit: "cover",
                              }}
                              alt="avatar"
                            />
                          </td>
                          <td>
                            {u.name} {u.surname}
                          </td>
                          <td>{u.email}</td>
                          <td>{u.username}</td>
                          <td>
                            <UserRoleBadgeModal
                              currentRole={u.role}
                              userId={u.id}
                              isCurrentUserAdmin={isCurrentUserAdmin}
                            />
                          </td>
                        </tr>
                      ))}

                      {users.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-4">
                            No users found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>

                  {/* Pagination */}
                  <div className="d-flex justify-content-between align-items-center">
                    <div style={{ fontSize: 14, opacity: 0.8 }}>
                      Page {page + 1} / {totalPages}
                    </div>

                    <Pagination className="mb-0">
                      <Pagination.First
                        disabled={page === 0}
                        onClick={() => setPage(0)}
                      />
                      <Pagination.Prev
                        disabled={page === 0}
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                      />

                      {paginationItems.map((p) => (
                        <Pagination.Item
                          key={p}
                          active={p === page}
                          onClick={() => setPage(p)}
                        >
                          {p + 1}
                        </Pagination.Item>
                      ))}

                      <Pagination.Next
                        disabled={page >= totalPages - 1}
                        onClick={() =>
                          setPage((p) => Math.min(totalPages - 1, p + 1))
                        }
                      />
                      <Pagination.Last
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(totalPages - 1)}
                      />
                    </Pagination>
                  </div>

                  {!isCurrentUserAdmin && (
                    <div
                      className="mt-3"
                      style={{ fontSize: 13, opacity: 0.75 }}
                    >
                      Only admins can change roles.
                    </div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default UsersListPage;
