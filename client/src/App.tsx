import { Button } from "@mui/material"
import GlobalSnackbar from "./components/GlobalSnackbar"
import { showError } from "./reducers/uiSlice"
import { useAppDispatch } from "./hooks"

const App = () => {
  const dispatch = useAppDispatch()
  return (
    <>
      <GlobalSnackbar></GlobalSnackbar>
      <Button onClick={() => dispatch(showError('an error'))}>Turn on</Button>
      <h1>hello world !!!</h1>
    </>
  )
}

export default App
