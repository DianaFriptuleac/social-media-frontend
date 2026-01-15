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

export interface UserInDepartment{
    id: string;
    name: string;
    surname: string;
    email: string;
    avatar?: string | null;
    roles: string[];
}

export interface DepartmentWithUsers {
    id:string;
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