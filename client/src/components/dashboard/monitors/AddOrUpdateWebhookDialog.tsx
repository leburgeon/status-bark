import { Dialog, DialogContent, DialogTitle, TextField, Button, Box } from "@mui/material"
import { Monitor } from "../../../reducers/monitorsSlice"
import { useState } from "react"

interface AddOrUpdateWebhookDialogProps {
  open: boolean,
  onClose: () => void,
  selectedMonitor: Monitor | null,
  onSubmit: (data: { unEncryptedWebhook: string | null }, id: string) => void
}

const AddOrUpdateWebhookDialog = ({ open, onClose, selectedMonitor, onSubmit }: AddOrUpdateWebhookDialogProps) => {

  const [newDiscordWebhook, setNewDiscordWebhook] = useState('')

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ unEncryptedWebhook: newDiscordWebhook }, selectedMonitor?.id || 'badid')
    onClose()
  }

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ unEncryptedWebhook: null }, selectedMonitor?.id || 'badid')
    onClose()
  }

  const handleWebhookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewDiscordWebhook(value)
  }

  const actionLabel = selectedMonitor?.discordWebhook.urlPresent
    ? 'Update'
    : 'Add'

  const renderDeleteWebhookButton = () => {
    return (
      <Button onClick={handleDelete}>
        Delete Webhook
      </Button>)
  }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{ paper: { sx: { borderRadius: 3, background: 'linear-gradient(145deg, #141414, #1e1e1e)' } } }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem', color: 'primary.main', letterSpacing: 2 }}>{`${actionLabel} Discord Webhook`}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <TextField
              label='Discord Webhook'
              onChange={handleWebhookChange}
              sx={{ minWidth: 300 }}
            />
            <Button variant="contained" type="submit">{actionLabel}</Button>
            {selectedMonitor?.discordWebhook.urlPresent && renderDeleteWebhookButton()}
          </Box>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default AddOrUpdateWebhookDialog

//TODO: Add validator to the url input field