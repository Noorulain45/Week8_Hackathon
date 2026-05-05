import { configureStore } from '@reduxjs/toolkit';
import { pdfApi } from './apiSlice';

export const store = configureStore({
  reducer: {
    [pdfApi.reducerPath]: pdfApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pdfApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;