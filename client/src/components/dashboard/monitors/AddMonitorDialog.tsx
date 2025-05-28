import React, { useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack
} from '@mui/material'
import { NewMonitorData } from '../../../reducers/monitorsSlice'

interface AddMonitorDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (data: NewMonitorData) => void
}

const AddMonitorDialog = ({ open, onClose, onAdd }: AddMonitorDialogProps) => {
  const [nickname, setNickname] = useState('')
  const [url, setUrl] = useState('')
  const [interval, setInterval] = useState(5)
  const [discordWebhook, setDiscordWebhook] = useState('')
  const [discordWebhookError, setDiscordWebhookError] = useState('')
  const [nicknameError, setNicknameError] = useState('')
  const [urlError, setUrlError] = useState('')

  const validateNickname = (value: string) => {
    if (!value) return ''
    if (value.length > 25) return 'Nickname must be 25 characters or less'
    return ''
  }

  const validateUrl = (value: string) => {
    if (!value) return ''
    try {
      new URL(value)
      return ''
    } catch {
      return 'Please enter a valid URL.'
    }
  }

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNickname(value)
    setNicknameError(validateNickname(value))
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUrl(value)
    setUrlError(validateUrl(value))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nicknameErr = validateNickname(nickname)
    const urlErr = validateUrl(url)
    setNicknameError(nicknameErr)
    setUrlError(urlErr)
    if (nicknameErr || urlErr || discordWebhookError) return
    onAdd({ nickname, url, interval, discordWebhook: discordWebhook ? discordWebhook : undefined })
    setNickname('')
    setUrl('')
    setInterval(5)
    setDiscordWebhook('')
    setNicknameError('')
    setUrlError('')
  }

  const handleClose = () => {
    onClose()
    setNickname('')
    setUrl('')
    setInterval(5)
    setDiscordWebhook('')
    setNicknameError('')
    setUrlError('')
  }

  const validateDiscordWebhook = (value: string) => {
    if (!value) return ''
    try {
      new URL(value)
      return ''
    } catch {
      return 'Please enter a valid URL.'
    }
  }

  const handleDiscordWebhookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDiscordWebhook(value)
    setDiscordWebhookError(validateDiscordWebhook(value))
  }

  return (
    <Dialog open={open} onClose={handleClose} slotProps={{ paper: { sx: { borderRadius: 3, background: 'linear-gradient(145deg, #141414, #1e1e1e)' } } }}>
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem', color: 'primary.main', letterSpacing: 2 }}>Add New Monitor</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Nickname"
              value={nickname}
              onChange={handleNicknameChange}
              required
              fullWidth
              autoFocus
              error={!!nicknameError}
              helperText={nicknameError}
            />
            <TextField
              label="URL"
              value={url}
              onChange={handleUrlChange}
              required
              fullWidth
              error={!!urlError}
              helperText={urlError}
            />
            <TextField
              label="Interval (minutes)"
              type="number"
              value={interval}
              onChange={e => setInterval(Number(e.target.value))}
              inputProps={{ min: 5, max: 120 }}
              required
              fullWidth
            />
            <TextField
              label="Discord Webhook (optional)"
              value={discordWebhook}
              onChange={handleDiscordWebhookChange}
              fullWidth
              error={!!discordWebhookError}
              helperText={discordWebhookError}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="outlined">Cancel</Button>
          <Button type="submit" color="primary" variant="contained">Add Monitor</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddMonitorDialog
