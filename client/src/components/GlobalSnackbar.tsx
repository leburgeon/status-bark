import { useDispatch, useSelector } from "react-redux"
import { Snackbar } from "@mui/material"
import { Alert } from "@mui/material"
import { hideSnackbar } from "../reducers/uiSlice"

const GlobalSnackbar = () => {
  const dispatch = useDispatch()
  const { snackbar } = useSelector((state) => state.ui)

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={() => dispatch(hideSnackbar({}))}
    >
      <Alert severity={snackbar.severity} onClose={() => dispatch(hideSnackbar({}))}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  )
}