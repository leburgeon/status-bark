import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAppDispatch } from "../../hooks"
import userService from "../../services/userService"
import { handleErrorsMessage } from "../../reducers/uiSlice"
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper
} from "@mui/material"

import { passwordStrength } from "check-password-strength"

const RegisterPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    const strength = passwordStrength(password)
    if (strength.id < 1) {
      setError("Password is too weak")
      return
    }
    try {
      await userService.registerUser({ email, password })
      navigate('/login')
    } catch (error) {
      dispatch(handleErrorsMessage(error))
    }
  }

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2
      }}
    >
      <Typography variant="h5" component="h1" align="center" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          fullWidth
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
        <Typography align="center" sx={{ my: -1, color: 'text.secondary' }}>
          (or)
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={() => navigate('/login')}
          sx={{ mt: 0 }}
        >
          Login
        </Button>
      </form>
    </Box>
  )
}

export default RegisterPage