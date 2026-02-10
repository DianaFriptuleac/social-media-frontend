import type { PageResponse } from "../types/page";
import type { PostCreateDTO, PostResponseDTO, PostUpdateDTO } from "../types/post";
import emptyApi from "./emptyApi";

type FindAllArgs = {
    page?: number;
    size?: number;
    sortBy?: string;
}

type FindByUserArgs = FindAllArgs & {
    userId: string;
}

type CreatePostArgs = {
    post: PostCreateDTO;
    files?: File[];
}
type UpdatePostArgs = {
    postId: string;
    post?: PostUpdateDTO;
    mediaToRemove?: string[];
    filesToAdd?: File[];
}

export const postsApi = emptyApi.injectEndpoints({
    endpoints: (build) => ({


        // POST /posts/with-media (multipart: post + files)
        createPostWithMedia: build.mutation<PostCreateDTO, CreatePostArgs>({
            query: ({ post, files }) => {
                const form = new FormData();
                form.append("post", JSON.stringify(post));
                (files ?? []).forEach((f) => form.append("files", f));  // name deve essere "files"
                return {
                    url: "/posts/with-media",
                    method: "POST",
                    body: form,
                };
            },
            invalidatesTags: (_res) => [{ type: "Posts" as const, id: "LIST" }],
        }),


        // GET /posts?page=0&size=8&sortBy=createdAt
        getPosts: build.query<PageResponse<PostResponseDTO>, FindAllArgs | void>({
            query: (args) => {
                const { page = 0, size = 8, sortBy = "createdAt" } = args ?? {};
                return {
                    url: `/posts`,
                    method: "GET",
                    params: { page, size, sortBy },
                };
            },
            providesTags: (result) =>
                result
                    ? [
                        { type: "Posts" as const, id: "LIST" },
                        ...result.content.map((p) => ({ type: "Posts" as const, id: p.id })),
                    ]
                    : [{ type: "Posts" as const, id: "LIST" }],
        }),


        // GET /posts/user/{userId}
        getPostsByUser: build.query<PageResponse<PostResponseDTO>, FindByUserArgs>({
            query: ({ userId, page = 0, size = 8, sortBy = "createdAt" }) => ({
                url: `/posts/user/${userId}`,
                method: "GET",
                params: { page, size, sortBy },
            }),
            providesTags: (result, _err, arg) =>
                result
                    ? [
                        { type: "UserPosts" as const, id: arg.userId },
                        ...result.content.map((p) => ({ type: "Posts" as const, id: p.id })),
                    ]
                    : [{ type: "UserPosts" as const, id: arg.userId }],

        }),

        // PATCH /posts/{postId}/with-media
        updatePostWithMedia: build.mutation<PostResponseDTO, UpdatePostArgs>({
            query: ({ postId, post, mediaToRemove, filesToAdd }) => {
                const form = new FormData();

                if (post && Object.keys(post).length > 0) {
                    form.append("post", JSON.stringify(post));
                }

                if (mediaToRemove && mediaToRemove.length > 0) {
                    form.append("mediaToRemove", JSON.stringify(mediaToRemove));
                }
                (filesToAdd ?? []).forEach((f) => form.append("filesToAdd", f));

                return {
                    url: `/posts/${postId}/with-media`,
                    method: "PATCH",
                    body: form,
                };
            },
            invalidatesTags: (_res, _err, arg) => [
                { type: "Posts" as const, id: arg.postId },
                { type: "Posts" as const, id: "LIST" },
            ],
        }),


        // DELETE /posts/{postId}
        deletePost: build.mutation<void, { postId: string; authorId?: string }>({
            query: ({ postId }) => ({
                url: `/posts/${postId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_res, _err, arg) => [
                { type: "Posts" as const, id: arg.postId },
                { type: "Posts" as const, id: "LIST" },
                ...(arg.authorId ? [{ type: "UserPosts" as const, id: arg.authorId }] : []),
            ]
        }),
    }),
    overrideExisting: false,
});

export const {
    useCreatePostWithMediaMutation,
    useGetPostsQuery,
    useGetPostsByUserQuery,
    useUpdatePostWithMediaMutation,
    useDeletePostMutation,
} = postsApi;
