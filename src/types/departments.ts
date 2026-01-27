export interface Department {
    id: string;
    name: string;
    description: string;
}

export interface DepartmentUIState {
    selectedDepartmentId: string | null;
    page: number;
    pageSize: number;
}

export interface UserInDepartment {
    id: string;
    name: string;
    surname: string;
    email: string;
    avatar?: string | null;
    roles: string[];
}

export interface DepartmentWithUsers {
    id: string;
    name: string;
    description: string;
    userCount: number;
    users: UserInDepartment[];
}

//Ruoli users in departments
export interface RolePickerProps {
    title?: string;
    availableRoles: string[];
    selectedRoles: string[];
    disabledRoles?: string[];
    onToggle: (role: string) => void;
    onAddCustom: (role: string) => void;
}

export interface CreateDepartmentPayload {
    name: string;
    description?: string;
}

export interface CreateDepartmentModalProps {
    show: boolean;
    onHide: () => void;
    onCreate: (payload: CreateDepartmentPayload) => void;
    isLoading: boolean;
    errorMsg?: string | null;
}

export interface UpdateDepartmentPayload {
  id: string;
  name?: string;
  description?: string;
}

export interface EditDepartmentModalProps {
    show: boolean;
    onHide: () => void;
    department: DepartmentWithUsers;
    onSave: (payload: UpdateDepartmentPayload)=> void;
    onDelete: (id: string) => void;
    isSaving: boolean;
    isDeleting: boolean;
    errorMsg?: string | null;
}