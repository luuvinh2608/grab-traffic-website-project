import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducer';

// Create the store
export const store = configureStore({
  reducer: rootReducer,
});

// Export the store type
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
