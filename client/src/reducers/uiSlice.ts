import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    snackbar: { message: '', severity: 'error', open: false },
  },
  reducers: {
    showError: (state, action) => {
      state.snackbar = {message: action.payload, severity: 'error', open: true}
    },
    hideSnackbar: (state, _action) => {
      state.snackbar.open = false
    }
  }
})

export const { showError, hideSnackbar } = uiSlice.actions
export default uiSlice.reducer