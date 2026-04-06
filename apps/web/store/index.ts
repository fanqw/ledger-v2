import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth-slice';
import shellReducer from './slices/shell-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shell: shellReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
