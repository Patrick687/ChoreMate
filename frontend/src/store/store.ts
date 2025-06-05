import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './modal';
import authReducer from './auth';
import groupsReducer from './groups';
import choreReducer from './chores';

const store = configureStore({
    reducer: {
        modal: modalReducer,
        auth: authReducer,
        groups: groupsReducer,
        chores: choreReducer
    },
    devTools: import.meta.env.MODE !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;