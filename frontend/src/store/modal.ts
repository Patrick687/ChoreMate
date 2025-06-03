import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ModalMode = "signup" | "login" | null;

interface ModalState {
    isOpen: boolean;
    mode: ModalMode;
}

const initialState: ModalState = {
    isOpen: false,
    mode: null,
};

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        openModal(state, action: PayloadAction<ModalMode>) {
            state.isOpen = true;
            state.mode = action.payload;
        },
        closeModal(state) {
            state.isOpen = false;
            state.mode = null;
        },
    },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;