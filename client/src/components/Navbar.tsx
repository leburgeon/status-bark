import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import AccountCircle from '@mui/icons-material/AccountCircle'
import Button from '@mui/material/Button'
import {useAppDispatch, useAppSelector} from '../hooks'
import { logout } from '../reducers/userSlice'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const loggedIn = useAppSelector(store => store.user.loggedIn)

  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleSignOut = () => {
    dispatch(logout())
    handleMenuClose()
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography color='primary' variant="h6" component="div" sx={{ flexGrow: 1 }}>
            STATUS-BARK
          </Typography>

          {!loggedIn ? (
            <Button color="inherit" onClick={() => navigate('/login')}>
              LOGIN
            </Button>
          ) : (
            <>
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleMenuClose}>ACCOUNT</MenuItem>
                <MenuItem onClick={handleSignOut}>SIGN OUT</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}