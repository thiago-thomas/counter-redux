import type { Action, ThunkAction } from "@reduxjs/toolkit"

// configureStore cria uma redux store,
// e requer um reducer como argumento
import { configureStore } from "@reduxjs/toolkit"
import counterReducer from "@/features/counter/counterSlice"

export const store = configureStore({
  reducer: {
    // Add the counter reducer to the store
    counter: counterReducer,
  },
})

// Infer the type of `store`
export type AppStore = typeof store
export type RootState = ReturnType<AppStore["getState"]>
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"]
// Define a reusable type describing thunk functions
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
