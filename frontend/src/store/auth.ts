import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../graphql/generated";

interface AuthState {
    token: string | null;
    user: User | null;
}

const token = sessionStorage.getItem("token");
const userRaw = sessionStorage.getItem("user");
const user = userRaw ? (JSON.parse(userRaw) as User) : null;

const initialState: AuthState = {
    token: token && user ? token : null,
    user: token && user ? user : null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth(state, action: PayloadAction<{ token: string; user: User; }>) {
            state.token = action.payload.token;
            state.user = action.payload.user;
            sessionStorage.setItem("token", action.payload.token);
            sessionStorage.setItem("user", JSON.stringify(action.payload.user));
        },
        logout(state) {
            state.token = null;
            state.user = null;
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
        },
    },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;