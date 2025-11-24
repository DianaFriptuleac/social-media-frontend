import type { User } from "../types/auth";
import type { UserDepartmentRolesView } from "../types/profile";

const API_BASE_URL = 'http://localhost:3001';  // backend Spring (URL base)

// Type of body x aggiornare il profilo (UserDTO del BE)
interface UpdateUserBody {
    name: string;
    surname: string;
    email: string;
    password?: string;            // opzionale: se presente cambio, altrimenti no
}


//GET /user/me - profile
export async function getMyProfileApi(token: string): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/user/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Error fetching profile")
    }
    return res.json();

}

// Get/user/me/departments
export async function getMyDepartmentsApi(token: string): Promise<UserDepartmentRolesView[]> {
    const res = await fetch(`${API_BASE_URL}/user/me/departments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Error fetching departments")
    }
    return res.json();

}
//PUT /user/me - aggiorna profilo
export async function updateMyProfileApi(token: string, body: UpdateUserBody): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/user/me`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Error updating profile")
    }
    return res.json();

}
//PATCH /user/me/avatar -> upload img
export async function uploadAvatarApi(token: string, file: File): Promise<{ avatarUrl: string }> {
    // FormData x multipart/form-data
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch(`${API_BASE_URL}/user/me/avatar`, {
        method: 'PATCH',
        headers: {
            // No content-type, fetch lo setta da solo x FormData
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });
    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Error uploading avatar")
    }
    return res.json();

}