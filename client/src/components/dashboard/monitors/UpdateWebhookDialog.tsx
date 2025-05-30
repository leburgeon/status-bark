import { Dialog } from "@mui/material"
import { useState } from "react"

const UpdateWebhookDialog = () => {
  // TODO move to the edit monitor dialog
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{ paper: { sx: { borderRadius: 3, background: 'linear-gradient(145deg, #141414, #1e1e1e)' } } }}
    >

    </Dialog>
  )
}

export default UpdateWebhookDialog