import GlobalSnackbar from "./components/GlobalSnackbar"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAppSelector } from "./hooks"
import LoginPage from "./components/user/LoginPage"
import RegisterPage from "./components/user/RegisterPage"
import MonitorsPage from "./components/dashboard/monitors/MonitorsPage"

const App = () => {
  const loggedIn = useAppSelector(state => state.user.loggedIn)
  return (
    <>
      <GlobalSnackbar/>
      <Routes>
        <Route path="/login" element={loggedIn ? <Navigate to='/'/> : <LoginPage/>}/>
        <Route path='/register' element={loggedIn ? <Navigate to='/'/> : <RegisterPage/>}/>
        <Route path='/' element={loggedIn ? <MonitorsPage/> : <LoginPage/>}/>
      </Routes>
    </>
  )
}

export default App
