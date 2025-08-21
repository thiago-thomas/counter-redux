import type { Action, ThunkAction } from "@reduxjs/toolkit"

// Criamos a store pelo "configureStore" 
import { configureStore } from "@reduxjs/toolkit"
import counterReducer from "@/features/counter/counterSlice"

export const store = configureStore({
  // dentro do objeto reducer 
  reducer: {
    // passamos o state global => 'counter' (state.counter)
    // e o seu reducer responsavel => 'counterReducer'
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
