/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit"
interface uiState {
  snackbar: {
    message: string,
    severity: 'error' | 'info' | 'success' | 'warning',
    open: boolean
  },
  fetching: boolean
}

const initialState: uiState = {
  snackbar: { message: '', severity: 'error', open: false },
  fetching: false
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showError: (state, action: PayloadAction<string>) => {
      state.snackbar = {message: action.payload, severity: 'error', open: true}
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false
    },
    setFetching: (state, action: PayloadAction<boolean>) => {
      state.fetching = action.payload
    }
  }
})

export const { showError, hideSnackbar, setFetching } = uiSlice.actions
export default uiSlice.reducer

export const handleErrorsMessage = (error: unknown) => {
  console.error(error)
  let message = ''
  if (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as any).isAxiosError === true
  ) {
    const axiosError = error as any
    message = axiosError.response?.data?.error || axiosError.message || 'Unexpected Error'
  } else if (error instanceof Error) {
    message = error.message
  } else {
    message = 'Unexpected Error'
  }

  return (dispatch: Dispatch) => {
    dispatch(showError(message))
  }
}