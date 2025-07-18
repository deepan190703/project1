import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

// For TypeScript users, these would be:
// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch