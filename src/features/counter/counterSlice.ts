// Este arquivo demonstra o uso típico da função createSlice do Redux Toolkit
// para definir a lógica do reducer e actions, além de thunks e seletores relacionados.

import type { AppThunk, RootState } from "@/app/store"
import type { PayloadAction } from "@reduxjs/toolkit"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { fetchCount } from "./counterAPI"

// Define o tipo TS para o state do slice counter
export interface CounterState {
  value: number
  status: "idle" | "loading" | "failed"
}

// Define o valor inicial para o state do slice
const initialState: CounterState = {
  value: 0,
  status: "idle",
}

// Slices contêm a lógica do reducer Redux para atualizar o state e
// geram actions que podem ser disparadas para acionar essas atualizações.
export const counterSlice = createSlice({
  name: "counter",
  initialState,
  // O campo `reducers` permite definir reducers e gerar actions associadas
  reducers: {
    increment: state => {
      // O Redux Toolkit permite escrever lógica "mutável" nos reducers. Ele
      // na verdade não muta o state porque usa a biblioteca Immer,
      // que detecta mudanças em um "state rascunho" e produz um novo
      // state imutável baseado nessas mudanças
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    // Use o tipo PayloadAction para declarar o conteúdo de `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
  },
  // O campo `extraReducers` permite que o slice trate actions definidas em outros lugares,
  // incluindo actions geradas por createAsyncThunk ou em outros slices.
  extraReducers: builder => {
    builder
      // Trata os tipos de ação definidos pelo thunk `incrementAsync` abaixo.
      // Isso permite que o reducer do slice atualize o state com o status da requisição e resultados.
      .addCase(incrementAsync.pending, state => {
        state.status = "loading"
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = "idle"
        state.value += action.payload
      })
      .addCase(incrementAsync.rejected, state => {
        state.status = "failed"
      })
  },
})

// Exporta os criadores de ação gerados para uso nos componentes
export const { increment, decrement, incrementByAmount } = counterSlice.actions

// Exporta o reducer do slice para uso na configuração da store
export default counterSlice.reducer

// Funções seletoras permitem selecionar um valor do state raiz do Redux.
// Seletores também podem ser definidos inline na chamada `useSelector`
// em um componente, ou dentro do campo `createSlice.selectors`.
export const selectCount = (state: RootState) => state.counter.value
export const selectStatus = (state: RootState) => state.counter.status

// A função abaixo é chamada de thunk, que pode conter lógica síncrona e assíncrona
// e tem acesso tanto ao `dispatch` quanto ao `getState`. Eles podem ser disparados como
// uma ação regular: `dispatch(incrementIfOdd(10))`.
// Aqui está um exemplo de disparar actions condicionalmente com base no state atual.
export const incrementIfOdd = (amount: number): AppThunk => {
  return (dispatch, getState) => {
    const currentValue = selectCount(getState())
    if (currentValue % 2 === 1) {
      dispatch(incrementByAmount(amount))
    }
  }
}

// Thunks são comumente usados para lógica assíncrona como buscar dados.
// O método `createAsyncThunk` é usado para gerar thunks que
// disparam actions de pending/fulfilled/rejected com base em uma promessa.
// Neste exemplo, fazemos uma requisição assíncrona simulada e retornamos o resultado.
// O campo `createSlice.extraReducers` pode tratar essas actions
// e atualizar o state com os resultados.
export const incrementAsync = createAsyncThunk(
  "counter/fetchCount",
  async (amount: number) => {
    const response = await fetchCount(amount)
    // O valor retornado se torna o payload da ação `fulfilled`
    return response.data
  },
)
