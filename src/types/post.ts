export interface PostCreateDTO {
    title?: string;
    description?: string;
    externalUrl?: string;
}

export interface PostUpdateDTO {
    title?: string;
    description?: string;
    externalUrl?: string;
}

export interface PostResponseDTO {
    id: string;
    title?: string;
    description?: string;
    externalUrl?: string;
    createdAt: string;

    author: {
        id: string;
        name: string;
        surname: string;
        avatar?: string;
    }

    // media come lista dal BE
    media?: Array<{
        id: string;
        url: string;
        type: string;  // "IMAGE" | "VIDEO"
    }>;
    isMine?: boolean;
}