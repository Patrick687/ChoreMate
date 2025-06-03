import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './modal';

const store = configureStore({
    reducer: {
        modal: modalReducer
    },
    devTools: import.meta.env.MODE !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;