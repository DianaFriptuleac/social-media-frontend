export type UUID = string;

export interface SharePostDTO {
    recipientIds: UUID[];
    message?: string | null;

}

export interface UserPublicDTO {
    id: UUID;
    name: string;
    surname: string;
    avatar?: string;
    role?: string;
}

export interface PostShareResponseDTO {
    id: UUID;
    postId: UUID;
    sender: UserPublicDTO;
    recipient: UserPublicDTO;
    message?: string | null;
    createdAt: string;
    read: boolean;
}