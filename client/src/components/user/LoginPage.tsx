import { useState } from "react"
import { useAppDispatch } from "../../hooks"
import { login } from "../../reducers/userSlice"
import { Button, TextField, Box, Typography, Paper } from "@mui/material"
import { useNavigate } from "react-router-dom"

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(login({email, password}))   
  }
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" align="center" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">Login</Button>
            <Button variant="outlined" color="secondary" onClick={() => {navigate('/register')}}>Register</Button>
          </Box>
        </form>
      </Paper>
    </Box>
  )
}

export default LoginPage