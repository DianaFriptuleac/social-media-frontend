import { useMemo, useState } from "react";
import { useSharePostMutation } from "../../api/postApi";
import { useGetAllUsersQuery } from "../../api/userApi";
import { useAppSelector } from "../../store/hooks";
import { Alert, Modal, Spinner, Form, Image, Button } from "react-bootstrap";
import "../../css/Posts.css";

type Props = {
  show: boolean;
  onHide: () => void;
  postId: string;
};

const SharePostModal = ({ show, onHide, postId }: Props) => {
  const me = useAppSelector((s) => s.auth.user);

  const {
    data,
    isLoading: loadingUsers,
    error: usersError,
  } = useGetAllUsersQuery({
    page: 0,
    size: 100,
  });

  const [sharePost, { isLoading: sharing, error: shareError }] =
    useSharePostMutation();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const users = useMemo(() => {
    // useMemo - memorizzare (cache) un valore calcolato - ricalcolarlo solo quando cambiano le dipendenze (data o me)
    const list = data?.content ?? [];
    // non selezionare "me"
    return me ? list.filter((u) => u.id !== me.id) : list; //filtro la lista per rimuovere me stesso o ritorno la lista
  }, [data, me]);

  // aggiunge o rimuove un id dalla lista selectedIds
  const toggle = (id: string) => {
    setSelectedIds(
      (prev) =>
        prev.includes(id) // Se l'id è già presente nella lista
          ? prev.filter((x) => x !== id) // lo rimuovo filtrando l'array
          : [...prev, id], // altrimenti lo aggiungo creando un nuovo array
    );
  };
  const resetAndClose = () => {
    setSelectedIds([]);
    setMessage("");
    onHide();
  };

  const onSubmit = async () => {
    if (selectedIds.length === 0) return;

    const trimmed = message.trim();

    await sharePost({
      postId,
      body: {
        recipientIds: selectedIds,
        message: trimmed.length > 0 ? trimmed : null,
      },
    }).unwrap();
    resetAndClose();
  };

  return (
    <Modal show={show} onHide={onHide} centered className="createpost-modal">
      <Modal.Header closeButton>
        <Modal.Title>Share post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loadingUsers && <Spinner />}

        {usersError && (
          <Alert variant="danger" className="mb-2">
            Error loading users
          </Alert>
        )}
        {!loadingUsers && !usersError && (
          <>
            <div className="share-user-list mb-3">
              {users.map((u) => {
                const checked = selectedIds.includes(u.id);

                return (
                  <div
                    key={u.id}
                    className={`share-user-row ${checked ? "share-user-row--checked" : ""}`}
                    onClick={() => toggle(u.id)}
                  >
                    {/* LEFT */}
                    <div className="d-flex align-items-center gap-2">
                      {u.avatar ? (
                        <Image
                          src={u.avatar}
                          roundedCircle
                          className="createpost-avatar"
                          alt="avatar"
                        />
                      ) : (
                        <div className="createpost-avatar-placeholder">
                          {u.name?.[0]}
                        </div>
                      )}
                      <span>
                        {u.name} {u.surname}
                      </span>
                    </div>

                    {/* RIGHT */}
                    <Form.Check
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(u.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                );
              })}

              {users.length === 0 && (
                <div className="post-meta p-2">No users</div>
              )}
            </div>

            <Form.Group className="mb-2">
              <Form.Label>Message (optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={message}
                className="createpost-textarea"
                onChange={(e) => setMessage(e.target.value)}
              />
              {shareError && (
                <Alert variant="danger" className="mb-0">
                  Error while sharing
                </Alert>
              )}
            </Form.Group>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={sharing}>
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={sharing || selectedIds.length === 0}
        >
          {sharing ? "Sharing..." : `Share (${selectedIds.length})`}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default SharePostModal;
