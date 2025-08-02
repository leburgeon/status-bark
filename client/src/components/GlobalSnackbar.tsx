import { useAppDispatch, useAppSelector } from "../hooks"
import { Snackbar } from "@mui/material"
import { Alert } from "@mui/material"
import { hideSnackbar } from "../reducers/uiSlice"

const GlobalSnackbar = () => {
  const dispatch = useAppDispatch()
  const { snackbar } = useAppSelector((state) => state.ui)

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={() => dispatch(hideSnackbar())}
    >
      <Alert severity={snackbar.severity} onClose={() => dispatch(hideSnackbar())}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  )
}

export default GlobalSnackbar