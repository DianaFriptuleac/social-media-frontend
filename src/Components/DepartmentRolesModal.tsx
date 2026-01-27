import { useEffect, useMemo, useState } from "react";
import {
  useAssignRolesMutation,
  useRemoveDepartmentRoleFromUserMutation,
} from "../api/departmentApi";
import { Button, Modal, Alert, Badge } from "react-bootstrap";
import RolePicker from "./RolePicker";

interface DepartmentRolesModalProps {
  userId: string;
  departmentId: string;
  //Ruli attuali dell'utente nel department(da DepartmentWithUsers.users[i].roles)
  currentRoles: string[];
  // Ruloi suggeriti
  availableRoles?: string[];
  // Permesso per Admin
  canEdit: boolean;
}
const DEFAULT_AVAILABLE_ROLES = [
  "MANAGER",
  "EMPLOYEE",
  "HR",
  "IT",
  "ACCOUNTANT",
];

const normalizeRole = (role: string) =>
  role.trim().toUpperCase().replace(/\s+/g, "_");

const DepartmentRolesModal = ({
  userId,
  departmentId,
  currentRoles,
  availableRoles = DEFAULT_AVAILABLE_ROLES,
  canEdit,
}: DepartmentRolesModalProps) => {
  const [showModal, setShowModal] = useState(false);

  //seleziona solo i ruoli da aggiungere
  const [selectedToAdd, setSelectedToAdd] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const [assignRoles, { isLoading }] = useAssignRolesMutation();

  const [removeRoleFromDepartment, { isLoading: isRemovingRole }] =
    useRemoveDepartmentRoleFromUserMutation();

  const currentSet = useMemo(
    () => new Set(currentRoles.map(normalizeRole)),
    [currentRoles]
  );

  const canClick = canEdit === true;

  const resetModalState = () => {
    setShowModal(false);
    setSelectedToAdd([]);
    setShowConfirm(false);
    setAlertMsg(null);
  };
  const handleOpen = () => {
    if (!canEdit) return;
    setShowModal(true);
    setSelectedToAdd([]);
    setShowConfirm(false);
    setAlertMsg(null);
  };

  const handleClose = () => {
    resetModalState();
  };

  const toggleRoleToAdd = (roleRaw: string) => {
    const role = normalizeRole(roleRaw);
    if (!role) return;
    setAlertMsg(null);
    setSelectedToAdd((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  useEffect(() => {
    // se non c'e nulla da aggiungere, disattiva conferma
    if (selectedToAdd.length === 0) setShowConfirm(false);
  }, [selectedToAdd]);

  const goToConfirm = () => {
    if (selectedToAdd.length === 0) {
      setAlertMsg("Please select at least one role to add.");
      return;
    }
    setAlertMsg(null);
    setShowConfirm(true);
  };

  const handleRemoveRole = async (roleRow: string) => {
    const ok = window.confirm(`Do you want to remove the role ${roleRow} ?`);
    if (!ok) return;
    if (currentRoles.length <= 1) {
      setAlertMsg("A user must have at least one role in the department.");
      return;
    }

    try {
      await removeRoleFromDepartment({
        userId,
        departmentId,
        role: roleRow,
      }).unwrap();
      setAlertMsg(null);
    } catch (err: any) {
      const message =
        typeof err?.data?.message === "string"
          ? err.data.message
          : "Error while removing role";
      setAlertMsg(message);
    }
  };

  const handleConfirm = async () => {
    try {
      // chiamata BE per aggiunger ruoli mancanti
      await assignRoles({
        userId,
        departmentId,
        roles: selectedToAdd,
      }).unwrap();

      resetModalState();
    } catch (err: any) {
      const message =
        typeof err?.data?.msg === "string"
          ? err.data.msg
          : "Error while assigning roles";
      setAlertMsg(message);
    }
  };

  const handleBack = () => {
    setShowConfirm(false);
  };
  return (
    <>
      <Button
        variant="warning"
        size="sm"
        disabled={!canClick}
        onClick={canClick ? handleOpen : undefined}
        title={canClick ? "Edit roles in department" : "Admin only"}
      >
        Edit Roles
      </Button>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Roles in the Department</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {alertMsg && (
            <Alert variant="warning" className="mb-3">
              {alertMsg}
            </Alert>
          )}

          {!showConfirm ? (
            <>
              <div className="mb-3">
                <div className="mb-2">Current roles:</div>
                <div className="d-flex flex-wrap gap-1">
                  {currentRoles.length === 0 ? (
                    <Badge bg="secondary">No role</Badge>
                  ) : (
                    currentRoles.map((r) => (
                      <Badge
                        key={r}
                        bg="secondary"
                        className="d-inline-flex align-items-center gap-2"
                        style={{ padding: "0.4rem 0.6rem" }}
                      >
                        {normalizeRole(r)}
                        {canEdit && (
                          <span
                            onClick={() => handleRemoveRole(r)}
                            title="Rimuovi ruolo"
                            style={{
                              cursor: isRemovingRole
                                ? "not-allowed"
                                : "pointer",
                              fontWeight: 800,
                              lineHeight: 1,
                              opacity: isRemovingRole ? 0.6 : 1,
                            }}
                          >
                            ✕
                          </span>
                        )}
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              <RolePicker
                title="Select roles to add"
                availableRoles={availableRoles}
                selectedRoles={selectedToAdd}
                disabledRoles={currentRoles}
                onToggle={(role) => toggleRoleToAdd(role)}
                onAddCustom={(role) => {
                  if (currentSet.has(role)) {
                    setAlertMsg(
                      "This role already exists for the user in this department."
                    );
                    return;
                  }
                  setSelectedToAdd((prev) =>
                    prev.includes(role) ? prev : [...prev, role]
                  );
                  setAlertMsg(null);
                }}
              />
            </>
          ) : (
            <Alert variant="warning">
              <Alert.Heading>Do you confirm?</Alert.Heading>
              <p className="mb-2">You are about to add these roles:</p>
              <div className="d-flex flex-wrap gap-1">
                {selectedToAdd.map((r) => (
                  <Badge key={r} bg="primary">
                    {r}
                  </Badge>
                ))}
              </div>
            </Alert>
          )}
        </Modal.Body>

        <Modal.Footer>
          {!showConfirm ? (
            <>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={goToConfirm}
                disabled={selectedToAdd.length === 0}
              >
                Continue
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={handleBack}>
                No, go back
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Yes, add roles"}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default DepartmentRolesModal;
