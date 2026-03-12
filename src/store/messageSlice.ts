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
        // Cambia conversazione selezionata
        setSelectedConversation(state, action: PayloadAction<string | null>) {
            state.selectedConversationId = action.payload;  // aggiorna l'id della conversazione selezionata
            // Cambiando la conversazione si resetta la risposta al messaggio perché si entra in una nuova chat
            state.replyToMessage = null;
        },
        // Imposta il messaggio a cui si sta rispondendo
        setReplyToMessage(state, action: PayloadAction<MessageResponseDTO | null>) {
            state.replyToMessage = action.payload;
        },
        openNewConversationModal(state) {
            state.isNewConversationModalOpen = true;
        },
        closeNewConversationModal(state) {
            state.isNewConversationModalOpen = false;
        },
        resetMessageState(state) {
            state.selectedConversationId = null;
            state.replyToMessage = null;
            state.isNewConversationModalOpen = false;
        }
    },
});
// Export delle actions
export const {
    setSelectedConversation,
    setReplyToMessage,
    openNewConversationModal,
    closeNewConversationModal,
    resetMessageState,
} = messageSlice.actions;
// Export reducer
export default messageSlice.reducer;