import type { User } from "./auth";

//Ruoli user in department
export interface UserDepartmentRolesView {
    departmentId: string;
    departmentName: string;
    roles: string[];        //lista ruoli user
}

// Stato Redux della sezione profile
export interface ProfileState{
    profile: User | null;                        // dettagli user logato
    departments: UserDepartmentRolesView[];      // reparti + ruoli
    loading: boolean;                            // x spinner
    error: string | null;                        //error msg
}