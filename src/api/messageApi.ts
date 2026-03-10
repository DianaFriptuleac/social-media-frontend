import type {
    AttachmentResponseDTO, ConversationDetailDTO,
    ConversationListItemDTO, MessageResponseDTO, SendMessageRequestDTO, ConversationResponseDTO, CreateConversationRequestDTO
} from "../types/message";
import emptyApi from "./emptyApi";

export const messageApi = emptyApi.injectEndpoints({
    endpoints: (build) => ({

        // --------------------------------------------------
        // POST /api/messages/conversations/direct
        createDirectConversation: build.mutation<
            ConversationResponseDTO, // 1. tipo - tipo della RISPOSTA del backend
            CreateConversationRequestDTO  // 2. tipo - tipo dell'ARGOMENTO passato alla mutation
        >({
            query: (body) => ({     // "body" è di tipo CreateConversationRequestDTO
                url: "/api/messages/conversations/direct",
                method: "POST",
                body,
            }),
            // dopo la creazione di una conversazione, la lista conversazioni in cache
            // non è più aggiornata, quindi invalido il tag LIST
            // così RTK Query rifà automaticamente la query che lo fornisce
            invalidatesTags: [{ type: "Conversations", id: "LIST" }],
        }),


        // --------------------------------------------------
        // POST /api/messages/conversations/{conversationId}/clear
        clearConversation: build.mutation<void, // il backend restituisce void / nessun body utile
            { conversationId: string }  // ARGOMENTO: passo un oggetto con conversationId
        >({
            query: ({ conversationId }) => ({
                url: `/api/messages/conversations/${conversationId}/clear`,
                method: "POST"
            }),
            // invalidatesTags riceve:
            // _res = risultato della mutation
            // _err = eventuale errore
            // arg = argomento passato alla mutation, quindi { conversationId }
            // invalido:
            // - LIST delle conversazioni, perché clear cambia la lista e l'ultimo msg visibile
            // - i messaggi di quella conversazione, perché dopo clear il contenuto visibile cambia
            // - il dettaglio di quella conversazione per riallinearne lo stato in cache
            invalidatesTags: (_res, _err, arg) => [
                { type: "Conversations", id: "LIST" },
                { type: "ConversationMessages", id: arg.conversationId },
                { type: "ConversationDetail", id: arg.conversationId },
            ],
        }),

        // --------------------------------------------------
        // GET /api/messages/conversations
        getMyConversations: build.query<ConversationListItemDTO[], // RISPOSTA: array di ConversationListItemDTO
            void  // ARGOMENTO: nessun argomento richiesto dalla query
        >({
            query: () => ({
                url: "/api/messages/conversations",
                method: "GET",
            }),
            providesTags: (result) =>
                result
                    ? [
                        // per ogni conversazione aggiungo un tag specifico con il suo id
                        ...result.map((c) => ({ type: "Conversations" as const, id: c.id })),
                        { type: "Conversations" as const, id: "LIST" },
                    ]
                    : [{ type: "Conversations" as const, id: "LIST" }],
        }),

        // --------------------------------------------------
        // GET /api/messages/conversations/{conversationId}
        getConversationDetail: build.query<
            ConversationDetailDTO, // RISPOSTA: un singolo oggetto dettaglio conversazione (restituuito dal BE)
            string // ARGOMENTO: una stringa, cioè conversationId
        >({
            query: (conversationId) => ({
                url: `/api/messages/conversations/${conversationId}`,
                method: "GET",
            }),
            // dettaglio di una singola conversazione - collego al tag con l'id di quella conversazione
            providesTags: (_res, _err, conversationId) => [
                { type: "ConversationDetail", id: conversationId }
            ],
        }),

        // --------------------------------------------------
        // POST /api/messages
        sendMessage: build.mutation<MessageResponseDTO, SendMessageRequestDTO>({
            query: (body) => ({
                url: "/api/messages",
                method: "POST",
                body,
            }),
            invalidatesTags: (_res, _err, arg) => [
                { type: "Conversations", id: "LIST" },
                { type: "ConversationMessages", id: arg.conversationId },
            ],
        }),

        // --------------------------------------------------
        // GET /api/messages/conversation/{conversationId}/messages
        getConversationMessages: build.query<
            MessageResponseDTO[],
            { conversationId: string; page?: number; size?: number }
        >({
            query: ({ conversationId, page = 0, size = 50 }) => ({
                url: `/api/messages/conversation/${conversationId}/messages`,
                method: "GET",
                params: { page, size },
            }),
            providesTags: (_res, _err, arg) => [
                { type: "ConversationMessages", id: arg.conversationId },
            ],
        }),

        // --------------------------------------------------
        // POST /api/messages/{messageId}/read
        markMessageAsRead: build.mutation<void, { messageId: string; conversationId: string }>({
            query: ({ messageId }) => ({
                url: `/api/messages/${messageId}/read`,
                method: "POST",
            }),
            //nell'argomento tengo anche conversationId - mi serve per invalidare il tag corretto dei messaggi
            // della conversazione a cui appartiene quel messaggio
            invalidatesTags: (_res, _err, arg) => [
                // aggiorno la lista conversazioni perché unreadCount cambia
                { type: "Conversations", id: "LIST" },

                // aggiorno la lista messaggi della conversazione specifica
                { type: "ConversationMessages", id: arg.conversationId },
            ],
        }),

        // --------------------------------------------------
        // DELETE /api/messages/{messageId}
        deleteMessageForMe: build.mutation<void, { messageId: string; conversationId: string }>({
            query: ({ messageId }) => ({
                url: `/api/messages/${messageId}`,
                method: "DELETE",
            }),
            // invalido:
            // - lista conversazioni, perché ultimo messaggio visibile o ordine possono cambiare
            // - messaggi della conversazione, perché uno è stato rimosso "per me"
            invalidatesTags: (_res, _err, arg) => [
                { type: "Conversations", id: "LIST" },
                { type: "ConversationMessages", id: arg.conversationId },
            ],
        }),

        // --------------------------------------------------
        // POST /api/messages/{messageId}/attachments
        uploadAttachment: build.mutation<
            AttachmentResponseDTO,
            { messageId: string; file: File; conversationId: string }
        >({
            query: ({ messageId, file }) => {
                const formData = new FormData(); // FormData per i file
                formData.append("file", file);

                return {
                    url: `/api/messages/${messageId}/attachments`,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: (_res, _err, arg) => [
                { type: "ConversationMessages", id: arg.conversationId },
            ],
        }),

        // --------------------------------------------------
        // GET /api/messages/{messageId}/attachments
        getAttachmentsByMessage: build.query<AttachmentResponseDTO[],
            string  // ARGOMENTO: messageId
        >({
            query: (messageId) => ({
                url: `/api/messages/${messageId}/attachments`,
                method: "GET",
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useCreateDirectConversationMutation,
    useClearConversationMutation,
    useGetMyConversationsQuery,
    useGetConversationDetailQuery,
    useSendMessageMutation,
    useGetConversationMessagesQuery,
    useMarkMessageAsReadMutation,
    useDeleteMessageForMeMutation,
    useUploadAttachmentMutation,
    useGetAttachmentsByMessageQuery,
} = messageApi;