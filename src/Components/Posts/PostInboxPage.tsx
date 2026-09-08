import { useNavigate } from "react-router-dom";
import {
  useDeleteInboxItemMutation,
  useGetMyInboxQuery,
  useMarkInboxItemAsReadMutation,
} from "../../api/postApi";
import {
  Alert,
  Button,
  Container,
  Spinner,
  Card,
  Pagination,
} from "react-bootstrap";
import {
  useDeleteNotificationMutation,
  useGetMyNotificationsQuery,
  useMarkNotificationAsReadMutation,
} from "../../api/notificationsApi";
import { BsTrash } from "react-icons/bs";
import "../../css/Posts.css";
import { useEffect, useState } from "react";
import { getPaginationRange } from "../../utils/pagination";

const PostPageInbox = () => {
  const nav = useNavigate();
  const { data, isLoading, error, refetch, isFetching } = useGetMyInboxQuery({
    page: 0,
    size: 20,
  });
  const {
    data: notifications = [],
    isLoading: notificationsLoading,
    isError: notificationsError,
    refetch: refetchNotifications,
    isFetching: notificationsFetching,
  } = useGetMyNotificationsQuery(undefined, {pollingInterval: 150000});  // controlla ogni 15 sec. se ci sono notifiche

  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
  const [markAsRead] = useMarkInboxItemAsReadMutation();
  const [deleteNotifications] = useDeleteNotificationMutation();
  const [deleteInboxItem] = useDeleteInboxItemMutation();
  //pagination
  const [page, setPage] = useState(0);
  const pageSize = 6;

  const postItems = data?.content?.map((x) => ({
    id: x.id,
    kind: "POST" as const,
    createdAt: x.createdAt,
    read: x.read,
    title: `${x.sender.name} ${x.sender.surname}`,
    message: x.message || "Shared a post with you",
    postId: x.postId,
  })) ?? [];

  const notificationItems = notifications
    .filter((n) => n.type !== "EVENT_CANCELLED")
    .map((n) => ({
      id: n.id,
      kind: "NOTIFICATION" as const,
      createdAt: n.createdAt,
      read: n.read,
      title: n.title,
      message: n.message,
      type: n.type,
      eventId: n.eventId,
    }));

  const inboxItems = [...postItems, ...notificationItems].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  //pagination
  const totalPages = Math.ceil(inboxItems.length / pageSize);

  const paginatedInboxItems = inboxItems.slice(
    page * pageSize,
    page * pageSize + pageSize,
  );

  useEffect(() => {
    if (totalPages > 0 && page >= totalPages) {
      setPage(totalPages - 1);
    }
  }, [page, totalPages]);

  const pages = getPaginationRange(page, totalPages);

  if (isLoading || notificationsLoading) return <Spinner />;

  if (error || !data || notificationsError) {
    return (
      <Container className="mt-3 inbox-page">
        <Alert variant="danger">
          Error loading inbox
          <Button
            variant="link"
            onClick={() => {
              refetch();
              refetchNotifications();
            }}
          >
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-3 inbox-page">
      <div className="inbox-header">
        <h3 className="mb-0">Inbox</h3>
        <Button
          className="inbox-refresh"
          variant="outline-secondary"
          size="sm"
          onClick={() => {
            refetch();
            refetchNotifications();
          }}
        >
          {isFetching || notificationsFetching ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
      {inboxItems.length === 0 && (
        <div className="inbox-empty">No shared posts.</div>
      )}
      <div className="inbox-list">
        {paginatedInboxItems.map((x) => (
          <Card
            key={`${x.kind}-${x.id}`}
            className={`inbox-card ${x.read ? "" : "inbox-card--unread"}`}
          >
            <Card.Body>
              <div className="inbox-card-top">
                <div>
                  <div className="inbox-sender">
                    {x.kind === "POST" ? x.title : x.title}
                  </div>
                  <div className="inbox-date">
                    {new Date(x.createdAt).toLocaleString()}
                  </div>
                </div>
                {!x.read && <span className="inbox-badge">NEW</span>}
              </div>

              {x.message ? (
                <div className="inbox-message">{x.message}</div>
              ) : null}

              <div className="d-flex justify-content-between">
                <Button
                  className="inbox-actions"
                  size="sm"
                  onClick={async () => {
                    if (x.kind === "POST") {
                      if (!x.read) {
                        await markAsRead({ inboxItemId: x.id }).unwrap();
                      }
                      nav(`/posts/${x.postId}`);
                      return;
                    }
                    if (x.kind === "NOTIFICATION") {
                      if (!x.read) {
                        await markNotificationAsRead({
                          notificationId: x.id,
                        }).unwrap();
                      }
                      // Eventi
                      if (
                        x.type === "EVENT_INVITATION" ||
                        x.type === "EVENT_UPDATED"
                      ) {
                        if (x.eventId) {
                          nav(`/events/${x.eventId}`);
                        }

                        return;
                      }
                      // JOB STATUS
                      if (x.type === "JOB_APPLICATION_STATUS") {
                         nav(`/jobs/${x.eventId}`);
                        return;
                      }

                      // JOB CLOSED
                      if (x.type === "JOB_CLOSED") {
                        if (x.eventId) {
                          nav(`/jobs/${x.eventId}`);
                        }

                        return;
                      }

                      // JOB DELETED
                      if (x.type === "JOB_DELETED") {
                        nav("/jobs/my-applications");
                        return;
                      }
                    }
                  }}
                >
                  {x.kind === "POST"
                    ? "Open post"
                    : x.type?.startsWith("JOB_")
                      ? "View application"
                      : "Open event"}
                </Button>
                <Button
                  className="delete-inbox-btn"
                  variant="outline-danger"
                  size="sm"
                  onClick={async () => {
                    const ok = window.confirm("Delete this item?");
                    if (!ok) return;

                    if (x.kind === "POST") {
                      await deleteInboxItem({
                        inboxItemId: x.id,
                      }).unwrap();
                    }

                    if (x.kind === "NOTIFICATION") {
                      await deleteNotifications({
                        notificationId: x.id,
                      }).unwrap();
                    }
                  }}
                >
                  <BsTrash />
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination className="inbox-pagination justify-content-center mt-4">
          <Pagination.Prev
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          />
          {pages.map((p) => (
            <Pagination.Item
              key={p}
              active={p === page}
              onClick={() => setPage(p)}
            >
              {p + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={page === totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          />
        </Pagination>
      )}
    </Container>
  );
};
export default PostPageInbox;
