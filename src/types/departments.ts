export interface Department {
    id: string;
    name: string;
    description: string;
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