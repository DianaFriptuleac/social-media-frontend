import { useState } from "react";
import { useUpdateUserRoleMutation } from "../api/userApi";
import { Alert, Badge, Button, ListGroup, Modal } from "react-bootstrap";

interface RoleBadgeModalProps {
  currentRole: "ADMIN" | "USER";
  userId: string;
  isCurrentUserAdmin: boolean;
}

const UserRoleBadgeModal = ({
  currentRole,
  userId,
  isCurrentUserAdmin,
}: RoleBadgeModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"ADMIN" | "USER" | null>(
    null
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [updateUserRole, { isLoading }] = useUpdateUserRoleMutation();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const canClick = isCurrentUserAdmin === true;

  // Modifica role solo per ADMIN
  const handleBadgeClick = () => {
    if (!isCurrentUserAdmin) return; // se nn e admin, return
    setShowModal(true);
    setAlertMessage(null);
  };

  // Select Role
  const handleRoleSelect = (role: "ADMIN" | "USER") => {
    setSelectedRole(role);

    // Check se e lo stesso ruolo
    if (role === currentRole) {
      setAlertMessage("The user already has this role.");
      setShowConfirm(false);
      return;
    }

    setAlertMessage(null);
    setShowConfirm(true);
  };

  const handleConfirmChange = async () => {
    if (!selectedRole) return;
    try {
      await updateUserRole({ userId, role: selectedRole }).unwrap();
      alert(`Role successfully changed to ${selectedRole}!`);
      setShowModal(false);
      setShowConfirm(false);
      setSelectedRole(null);
      // Ricarica la pagina per aggiornare i dati
      window.location.reload();
    } catch (err: any) {
      console.error("Error updating role: ", err);
      setAlertMessage(err?.data?.message || "Error updating role");
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirm(false);
    setSelectedRole(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowConfirm(false);
    setSelectedRole(null);
    setAlertMessage(null);
  };
  return (
    <>
      {/*Badge cliccabile */}
      <Badge
        bg={currentRole === "ADMIN" ? "danger" : "success"}
        style={{
          cursor: isCurrentUserAdmin ? "pointer" : "default",
          pointerEvents: canClick ? "auto" : "none",
          opacity: canClick ? 1 : 0.7,
          fontSize: "0.9rem",
          padding: "0.4rem 0.8rem",
        }}
        onClick={canClick ? handleBadgeClick : undefined}
        title={
          canClick ? "Click to change role" : "Only admins can change roles"
        }
      >
        {currentRole}
      </Badge>
      {/*Modale cambio ruolo */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Change User Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alertMessage && (
            <Alert variant="warning" className="mb-3">
              {alertMessage}
            </Alert>
          )}
          {!showConfirm ? (
            <>
              <p className="mb-3">
                Current role: <strong>{currentRole}</strong>
              </p>
              <p className="mb-3">Select the new role: </p>
              {/* USER*/}
              <ListGroup>
                <ListGroup.Item
                  action
                  onClick={() => handleRoleSelect("USER")}
                  active={selectedRole === "USER"}
                  style={{ cursor: "pointer" }}
                >
                  <Badge bg="success" className="me-2">
                    USER
                  </Badge>
                </ListGroup.Item>
                {/* ADMIN*/}
                <ListGroup.Item
                  action
                  onClick={() => handleRoleSelect("ADMIN")}
                  active={selectedRole === "ADMIN"}
                  style={{ cursor: "pointer" }}
                >
                  <Badge bg="danger" className="me-2">
                    ADMIN
                  </Badge>
                </ListGroup.Item>
              </ListGroup>
            </>
          ) : (
            <Alert variant="warning">
              <Alert.Heading>Are you sure?</Alert.Heading>
              <p className="mb-0">
                Do you want to change the user role from{" "}
                <strong>{currentRole}</strong> to{" "}
                <strong>{selectedRole}</strong>?
              </p>
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!showConfirm ? (
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={handleCancelConfirm}>
                No, go back
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmChange}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Yes, change role"}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default UserRoleBadgeModal;
