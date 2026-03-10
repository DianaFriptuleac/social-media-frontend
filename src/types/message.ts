export interface ConversationUserDTO {
    id: string;
    name: string;
    surname: string;
    avatar?: string | null;
}

export interface ConversationResponseDTO {
    id: string;
    participantId: string[];
    createdAt: string;
}

export interface ConversationListItemDTO {
    id: string;
    createdAt: string;
    otherUser: ConversationUserDTO | null;
    lastMessageText: string | null;
    lastMessageSenderId: string | null;
    lastMessageCreatedAt: string | null;
    unreadCount: number;
}
export interface ConversationDetailDTO {
    id: string;
    createdAt: string;
    partecipants: ConversationUserDTO[];
}

export interface AttachmentResponseDTO {
    id: string;
    fileName: string;
    contentType: string;
    size: number;
    secureUrl: string;
    publicId: string;
    createdAt: string;
}

export interface MessageResponseDTO {
    id: string;
    conversationId: string;
    senderId: string;
    text: string | null;
    replyToMessageId: string | null;
    createdAt: string;
    readAt: string | null;
    attachments: AttachmentResponseDTO[];
}

export interface CreateConversationRequestDTO {
    otherUserId: string;
}

export interface SendMessageRequestDTO {
    conversationId: string;
    text: string;
    replyToMessageId?: string | null;
}