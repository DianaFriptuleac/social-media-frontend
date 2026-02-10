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

export type PostMediaType = "IMAGE" | "VIDEO" | "FILE";

export interface PostMediaDTO {
    id: string;
    url: string;
    type: PostMediaType;
}


export interface PostAuthorDTO {
    id: string;
    name: string;
    surname: string;
    avatar?: string;
}
export interface PostResponseDTO {
    id: string;
    title?: string;
    description?: string;
    externalUrl?: string;
    createdAt: string;

    author: PostAuthorDTO;

    media?: PostMediaDTO[];
    
    isMine?: boolean;
}