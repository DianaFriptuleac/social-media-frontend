import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MessageResponseDTO } from "../types/message";

interface MessageState {
    selectedConversationId: string | null;
    replyToMessage: MessageResponseDTO | null;
    isNewConversationModalOpen: boolean;
}
const initialState: MessageState = {
    selectedConversationId: null,
    replyToMessage: null,
    isNewConversationModalOpen: false,
}

const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        setSelectedConversation(state, action: PayloadAction<string | null>) {
            state.selectedConversationId = action.payload;
            state.replyToMessage = null;
        },
        setReplyToMessage(state, action: PayloadAction<MessageResponseDTO | null>){
            state.replyToMessage = action.payload;
        },
        openNewConversationModal(state) {
            state.isNewConversationModalOpen = true;
        },
        closeNewConversationModal(state) {
            state.isNewConversationModalOpen = false;
        },
    },
});
export const {
    setSelectedConversation,
    setReplyToMessage,
    openNewConversationModal,
    closeNewConversationModal,
} = messageSlice.actions;

export default messageSlice.reducer;