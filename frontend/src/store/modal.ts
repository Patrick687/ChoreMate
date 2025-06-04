import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ModalMode = "login" | "signup" | "inviteMember" | "addChore" | "choreDetail" | "relogError" | null;

interface ModalState {
    isOpen: boolean;
    mode: ModalMode;
    modalProps?: Record<string, any>;
}

const initialState: ModalState = {
    isOpen: false,
    mode: null,
    modalProps: {},
};

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<{ mode: ModalMode; props?: Record<string, any>; }>) => {
            state.isOpen = true;
            state.mode = action.payload.mode;
            state.modalProps = action.payload.props || {};
        },
        closeModal: (state) => {
            state.isOpen = false;
            state.mode = null;
            state.modalProps = {};
        },
    },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;