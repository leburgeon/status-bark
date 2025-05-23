import { Button } from "@mui/material"
import GlobalSnackbar from "./components/GlobalSnackbar"
import { showError } from "./reducers/uiSlice"
import { useAppDispatch } from "./hooks"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAppSelector } from "./hooks"
import LoginPage from "./components/user/LoginPage"
import RegisterPage from "./components/user/RegisterPage"

const App = () => {
  const dispatch = useAppDispatch()
  const loggedIn = useAppSelector(state => state.user.loggedIn)
  return (
    <>
      <GlobalSnackbar></GlobalSnackbar>
      <Button onClick={() => dispatch(showError('an error'))}>Turn on</Button>
      <h1>hello world !!!</h1>
      <Routes>
        <Route path="/login" element={loggedIn ? <Navigate to='/'/> : <LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
      </Routes>
    </>
  )
}

export default App
