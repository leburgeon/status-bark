import { Button } from "@mui/material"
import GlobalSnackbar from "./components/GlobalSnackbar"
import { showError } from "./reducers/uiSlice"
import { useDispatch, UseDispatch } from "react-redux"

const App = () => {
  const dispatch = useDispatch()

  return (
    <>
      <GlobalSnackbar></GlobalSnackbar>
      <Button onClick={() => dispatch(showError('an error'))}>Turn on</Button>
      <h1>hello world !!!</h1>
    </>
  )
}

export default App
