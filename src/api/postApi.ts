import type { PageResponse } from "../types/page";
import type { PostCreateDTO, PostResponseDTO, PostUpdateDTO } from "../types/post";
import { type SharePostDTO, type PostShareResponseDTO, type CommentResponseDTO, type CommentCreateDTO } from "../types/postShare";
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
    files?: File[]; // lista file da upload
}
type UpdatePostArgs = {
    postId: string;
    post?: PostUpdateDTO;
    mediaToRemove?: string[];  // lista di UUID dei media da rimuovere
    filesToAdd?: File[];  // nuovi file da aggiungere
}

/**
 * Inietto gli endpoint "posts" dentro la emptyApi (un solo reducerPath: 'api')
 */
export const postsApi = emptyApi.injectEndpoints({
    endpoints: (build) => ({


        // --------- POST /posts/with-media (multipart: post + files) -----------------
        createPostWithMedia: build.mutation<PostCreateDTO, CreatePostArgs>({
            query: ({ post, files }) => {
                const form = new FormData();  // FormData serve per multipart/form-data (upload file)

                // "post" deve essere una stringa JSON
                form.append("post", JSON.stringify(post));

                // aggiungo tutti i file con name "files" (deve combaciare col @RequestPart("files") del BE)
                (files ?? []).forEach((f) => form.append("files", f));  // name deve essere "files"
                //config della request per RTK Query
                return {
                    url: "/posts/with-media",
                    method: "POST",
                    body: form,
                };
            },
            // dopo una create invalida la lista dei post - refetch automatico di getPosts
            invalidatesTags: (_res) => [{ type: "Posts" as const, id: "LIST" }],
        }),


        //--------------------  GET /posts?page=0&size=8&sortBy=createdAt ------------
        getPosts: build.query<PageResponse<PostResponseDTO>, FindAllArgs | void>({
            // args può essere undefined (quando useGetPostsQuery() chiamato senza parametri)
            query: (args) => {
                // set default se args non c’è
                const { page = 0, size = 8, sortBy = "createdAt" } = args ?? {};
                return {
                    url: `/posts`,
                    method: "GET",
                    params: { page, size, sortBy },
                };
            },
            // tags: serve per cache+invalidazione
            // - "LIST" - lista paginata generale
            // - ogni post ha anche un tag con id = post.id (utile per invalidare il singolo post)
            providesTags: (result) =>
                result
                    ? [
                        { type: "Posts" as const, id: "LIST" },
                        ...result.content.map((p) => ({ type: "Posts" as const, id: p.id })),
                    ]
                    : [{ type: "Posts" as const, id: "LIST" }],
        }),


        //----------------------- GET /posts/user/{userId} ----------------------
        getPostsByUser: build.query<PageResponse<PostResponseDTO>, FindByUserArgs>({
            query: ({ userId, page = 0, size = 8, sortBy = "createdAt" }) => ({
                url: `/posts/user/${userId}`,
                method: "GET",
                params: { page, size, sortBy },
            }),
            // - "UserPosts" - lista di un utente (invalidare solo quella lista)
            providesTags: (result, _err, arg) =>
                result
                    ? [
                        { type: "UserPosts" as const, id: arg.userId },
                        ...result.content.map((p) => ({ type: "Posts" as const, id: p.id })),
                    ]
                    : [{ type: "UserPosts" as const, id: arg.userId }],

        }),

        //-------------------  PATCH /posts/{postId}/with-media -------------------
        /* multipart/form-data con:
     * - "post" (JSON) opzionale
     * - "mediaToRemove" (JSON array) opzionale
     * - "filesToAdd" (file multipli) opzionale
     */
        updatePostWithMedia: build.mutation<PostResponseDTO, UpdatePostArgs>({
            query: ({ postId, post, mediaToRemove, filesToAdd }) => {
                const form = new FormData();

                // se post esiste e ha almeno una chiave - allego JSON
                if (post && Object.keys(post).length > 0) {
                    form.append("post", JSON.stringify(post));
                }

                // se ho media da rimuovere - allego JSON array
                if (mediaToRemove && mediaToRemove.length > 0) {
                    form.append("mediaToRemove", JSON.stringify(mediaToRemove));
                }
                // aggiungo i file nuovi con name "filesToAdd"
                (filesToAdd ?? []).forEach((f) => form.append("filesToAdd", f));

                return {
                    url: `/posts/${postId}/with-media`,
                    method: "PATCH",
                    body: form,
                };
            },
            // - invalida il post specifico (id = postId) se qualcuno lo sta leggendo
            // - invalida la lista generale (LIST) per aggiornare feed
            invalidatesTags: (_res, _err, arg) => [
                { type: "Posts" as const, id: arg.postId },
                { type: "Posts" as const, id: "LIST" },
            ],
        }),


        //-----------------------  DELETE /posts/{postId} -----------------------
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

        //-----------------------  Share post -----------------------
        sharePost: build.mutation<void, { postId: string, body: SharePostDTO }>({
            query: ({ postId, body }) => ({
                url: `/posts/${postId}/share`,
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "PostInbox" as const, id: "LIST" }],
        }),

        //-----------------------  get my inbox -----------------------
        getMyInbox: build.query<PageResponse<PostShareResponseDTO>, { page?: number; size?: number } | void>({
            query: (args) => {
                const { page = 0, size = 20 } = args ?? {};
                return {
                    url: `/me/inbox`,
                    method: "GET",
                    params: { page, size },
                };
            },
            providesTags: (result) =>
                result
                    ? [
                        { type: "PostInbox" as const, id: "LIST" },
                        ...result.content.map((x) => ({ type: "PostInbox" as const, id: x.id })),
                    ]
                    : [{ type: "PostInbox" as const, id: "LIST" }],
        }),

        //-----------------------  get post by id -----------------------
        getPostById: build.query<PostResponseDTO, { postId: string }>({
            query: ({ postId }) => ({
                url: `/posts/${postId}`,
                method: "GET",
            }),
            providesTags: (_res, _err, arg) => [{ type: "Posts" as const, id: arg.postId }],
        }),

        //-------------------------POSTS COMMENTS ---------------------------------------
        //-------------------------create comment -----------------
        createComment: build.mutation<CommentResponseDTO, { postId: string; body: CommentCreateDTO }>({
            query: ({ postId, body }) => ({
                url: `/posts/${postId}/comments`,
                method: "POST",
                body,
            }),
            invalidatesTags: (_res, _err, arg) => [{ type: "Comments" as const, id: arg.postId }],
        }),

        //-------------------------get comments-----------------
        getComments: build.query<CommentResponseDTO[], { postId: string }>({
            query: ({ postId }) => ({
                url: `/posts/${postId}/comments`,
                method: "GET"
            }),
            providesTags: (_res, _err, arg) => [{ type: "Comments" as const, id: arg.postId }],
        }),
        //-------------------------delete comment -----------------
        deleteComment: build.mutation<void, { commentId: string; postId: string }>({
            query: ({ commentId }) => ({
                url: `/comments/${commentId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_res, _err, arg) => [{ type: "Comments" as const, id: arg.postId }],
        }),

    }),
    // non sovrascrivere endpoint se già iniettati altrove
    overrideExisting: false,
});

export const {
    useCreatePostWithMediaMutation,
    useGetPostsQuery,
    useGetPostsByUserQuery,
    useUpdatePostWithMediaMutation,
    useDeletePostMutation,
    useSharePostMutation,
    useGetMyInboxQuery,
    useGetPostByIdQuery,
    useCreateCommentMutation,
    useGetCommentsQuery,
    useDeleteCommentMutation,
} = postsApi;
