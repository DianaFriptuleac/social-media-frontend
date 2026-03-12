import { useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Form,
  ListGroup,
  Modal,
  Spinner,
} from "react-bootstrap";
import { useGetAllUsersQuery } from "../../api/userApi";
import { useCreateDirectConversationMutation } from "../../api/messageApi";
import type { UserListItem } from "../../types/profile";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  closeNewConversationModal,
  setSelectedConversation,
} from "../../store/messageSlice";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import "../../css/Messages.css";

const NewConversationModal = () => {
  const dispatch = useAppDispatch();
  const { isNewConversationModalOpen } = useAppSelector((s) => s.message);
  const currentUser = useAppSelector((u) => u.auth.user);

  const [query, setQuery] = useState(""); // testo digitato nel campo di ricerca
  // Versione "ritardata" della query, aggiornata dopo 250ms per evita di filtrare subito ad ogni carattere
  const debouncedQuery = useDebouncedValue(query, 250);

  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null); //utente selezionato nella lista risultati
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // RTK Query per caricare tutti gli utenti
  // - page: 0 = prima pagina
  // - size: 200 = massimo 200 utenti
  // - skip: se il modale è chiuso, la query non parte
  const { data, isFetching, isError } = useGetAllUsersQuery(
    { page: 0, size: 200 },
    { skip: !isNewConversationModalOpen },
  );

  const [createDirectConversation, { isLoading: isCreating }] = //isLoading rinominato - isCreating
    useCreateDirectConversationMutation();

  // Estrae la lista utenti dalla risposta API
  const allUsers = data?.content ?? [];

  // min. 2 caratteri, ignorando spazi iniziali/finali
  const canSearch = debouncedQuery.trim().length >= 2;

  const results = useMemo(() => {
    //evita di rifare il calcolo se le dipendenze non cambiano
    if (!canSearch) return [];

    const q = debouncedQuery.trim().toLowerCase();

    return allUsers
      .filter((u) => {
        if (u.id === currentUser?.id) return false; //non creare una chat con te stesso
        // Crea una stringa unica con nome, cognome, email e username
        // convertita in minuscolo per confronto semplificato
        const hay =
          `${u.name} ${u.surname} ${u.email} ${u.username}`.toLowerCase();
        return hay.includes(q); // tiene solo gli utenti che contengono la query
      })
      .slice(0, 25); // i primi 25 risultati
  }, [allUsers, canSearch, debouncedQuery, currentUser?.id]);

  // Chiude il modale
  const handleClose = () => {
    setQuery("");
    setSelectedUser(null);
    setErrorMsg(null);
    dispatch(closeNewConversationModal()); // aggiorna Redux per chiudere il modale
  };

  // Crea una nuova conversazione
  const handleCreate = async () => {
    if (!selectedUser) {
      setErrorMsg("Select a user.");
      return;
    }

    try {
      const conversation = await createDirectConversation({
        otherUserId: selectedUser.id,
      }).unwrap(); // unwrap(): - se va bene, ottiene il risultato; - se fallisce, entra nel catch

      dispatch(setSelectedConversation(conversation.id)); // Salva nello store Redux la conversazione creata/selezionata
      handleClose();
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Error creating conversation.");
    }
  };

  return (
    <Modal
      className="new-conversation-modal"
      show={isNewConversationModalOpen}
      onHide={handleClose}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>New conversation</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {errorMsg && <Alert variant="warning">{errorMsg}</Alert>}
        {isError && <Alert variant="danger">Error loading users.</Alert>}

        <Form.Group className="mb-3">
          <Form.Label>Search user</Form.Label>
          <Form.Control
            className="new-conversation-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, surname, email..."
            autoFocus
          />
          <Form.Text className="text-muted">Minimum 2 characters.</Form.Text>
        </Form.Group>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <strong>Results</strong>
          {isFetching && <Spinner animation="border" size="sm" />}
        </div>

        <ListGroup style={{ maxHeight: 320, overflowY: "auto" }}>
          {!canSearch && (
            <ListGroup.Item className="text-muted">
              Start typing to search users…
            </ListGroup.Item>
          )}

          {canSearch && !isFetching && results.length === 0 && (
            <ListGroup.Item className="text-muted">
              No users found.
            </ListGroup.Item>
          )}

          {results.map((u) => {
            const active = selectedUser?.id === u.id;

            return (
              <ListGroup.Item
                key={u.id}
                action
                active={active}
                onClick={() => setSelectedUser(u)}
                className="new-conversation-item d-flex justify-content-between align-items-start"
              >
                <div>
                  <div className="fw-bold">
                    {u.surname} {u.name}
                  </div>
                  <div className="small">{u.email}</div>
                </div>

                {active && (
                  <Badge bg="light" text="dark">
                    Selected
                  </Badge>
                )}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleCreate}
          disabled={!selectedUser || isCreating}
        >
          {isCreating ? "Creating..." : "Create chat"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewConversationModal;
