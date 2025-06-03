import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
        // your reducers here
    },
    devTools: import.meta.env.MODE !== 'production',
});

export default store;