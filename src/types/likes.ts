import type { UserPublicDTO } from "./postShare";

export interface PostLikeStatusDTO {
    likeCount: number;
    likedByMe: boolean;
}
export interface PostLikeUsersDTO{
    likeCount: number;
    users: UserPublicDTO[];
}