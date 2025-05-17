import { createSlice, PayloadAction } from "@reduxjs/toolkit"


interface uiState {
  snackbar: {
    message: string,
    severity: 'error' | 'info' | 'success' | 'warning',
    open: boolean
  }
}

const initialState: uiState = {
  snackbar: { message: '', severity: 'error', open: false }
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
    }
  }
})

export const { showError, hideSnackbar } = uiSlice.actions
export default uiSlice.reducer