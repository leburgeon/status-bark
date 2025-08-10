import { useState, useEffect } from "react"
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack
} from '@mui/material'
import { Monitor } from "../../../reducers/monitorsSlice"

interface EditMonitorDialogProps {
  open: boolean,
  onClose: () => void,
  onSubmit: (data: { url: string, interval: number, nickname: string }, id: string) => void,
  selectedMonitor: Monitor | null,
  openWebhookDialog: () => void
}

const EditMonitorDialog = ({ open, onClose, onSubmit, selectedMonitor, openWebhookDialog }: EditMonitorDialogProps) => {
  const [nickname, setNickname] = useState('')
  const [url, setUrl] = useState('')
  const [interval, setInterval] = useState(0)
  const [nicknameError, setNicknameError] = useState('')
  const [urlError, setUrlError] = useState('')

  useEffect(() => {
    if (open && selectedMonitor) {
      setNickname(selectedMonitor.nickname)
      setUrl(selectedMonitor.url)
      setInterval(selectedMonitor.interval)
      setNicknameError('')
      setUrlError('')
    }
  }, [selectedMonitor, open])

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

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterval(Number(e.target.value))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nicknameErr = validateNickname(nickname)
    const urlErr = validateUrl(url)
    setNicknameError(nicknameErr)
    setUrlError(urlErr)
    if (nicknameErr || urlErr) return
    onSubmit({ nickname, url, interval }, selectedMonitor?.id || 'badid')
    onClose()
  }

  const handleOpenWebhookDialog = () => {
    openWebhookDialog()
    onClose()
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { borderRadius: 3, background: 'linear-gradient(145deg, #141414, #1e1e1e)' } } }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem', color: 'primary.main', letterSpacing: 2 }}>Edit Monitor</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ paddingBottom: 1 }}>
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
              onChange={handleIntervalChange}
              inputProps={{ min: 5, max: 120 }}
              required
              fullWidth
            />
            <Button
              onClick={handleOpenWebhookDialog}
              sx={{
                paddingBottom: 0,
                alignSelf: 'center',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'primary.main',
                background: 'none',
                boxShadow: 'none',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 'none',
                  background: 'none',
                },
                '&:focus': {
                  boxShadow: 'none',
                  background: 'none',
                },
                '&:active': {
                  boxShadow: 'none',
                  background: 'none',
                },
              }}
            >
              {selectedMonitor?.discordWebhook.urlPresent
                ? 'Update discord webhook'
                : 'Add discord webhook'}
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={onClose} color="secondary" variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button disabled={selectedMonitor === null || (nickname === selectedMonitor.nickname && url === selectedMonitor.url && interval === selectedMonitor.interval)} type="submit" color="primary" variant="contained" sx={{ borderRadius: 2, fontWeight: 600, minWidth: 100 }}>Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditMonitorDialog