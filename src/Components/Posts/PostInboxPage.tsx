import { useNavigate } from "react-router-dom";
import { useGetMyInboxQuery } from "../../api/postApi";
import { Alert, Button, Container, Spinner, Card } from "react-bootstrap";

const PostPageInbox = () => {
  const nav = useNavigate();
  const { data, isLoading, error, refetch, isFetching } = useGetMyInboxQuery({
    page: 0,
    size: 20,
  });

  if (isLoading) return <Spinner />;

  if (error || !data) {
    return (
      <Container className="mt-3 inbox-page">
        <Alert variant="danger">
          Error loading inbox
          <Button variant="link" onClick={() => refetch()}>
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
          onClick={() => refetch()}
        >
          {isFetching ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
      {data.content.length === 0 && (
        <div className="inbox-empty">No shared posts.</div>
      )}
      <div className="inbox-list">
        {data.content.map((x) => (
          <Card
            key={x.id}
            className={`inbox-card ${x.read ? "" : "inbox-card--unread"}`}
          >
            <Card.Body>
              <div className="inbox-card-top">
                <div>
                  <div className="inbox-sender">
                    {x.sender.name} {x.sender.surname}
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

              <Button
                className="inbox-actions"
                size="sm"
                onClick={() => nav(`/posts/${x.postId}`)}
              >
                Open post
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
};
export default PostPageInbox;
