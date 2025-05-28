import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, DialogContentText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface DeleteMonitorDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  monitorNickname: string;
}

const DeleteMonitorDialog = ({ open, onClose, onConfirm, monitorNickname }: DeleteMonitorDialogProps) => {
  const [confirmText, setConfirmText] = useState('');
  const theme = useTheme();

  const handleDelete = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (confirmText === 'confirm') {
      onConfirm();
      setConfirmText('');
    }
  };

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{ paper: { sx: { borderRadius: 3, background: 'linear-gradient(145deg, #141414, #1e1e1e)' } } }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem', color: 'primary.main', letterSpacing: 2 }}>Delete Monitor</DialogTitle>
      <form onSubmit={handleDelete}>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText sx={{ color: theme.palette.text.secondary }}>
              Are you sure you want to delete <b>{`"${monitorNickname}"`}</b>?<br />
              <span style={{ color: theme.palette.error.main, fontWeight: 500 }}>
                Type <b>confirm</b> below to proceed.
              </span>
            </DialogContentText>
            <TextField
              autoFocus
              label="Type 'confirm' to delete"
              type="text"
              fullWidth
              variant="outlined"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              sx={{
                background: theme.palette.background.default,
                borderRadius: 1,
                input: { fontWeight: 500, letterSpacing: 0.5 },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button
            type="submit"
            color="error"
            variant="contained"
            sx={{ borderRadius: 2, fontWeight: 600, minWidth: 100 }}
            disabled={confirmText !== 'confirm'}
          >
            Delete
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DeleteMonitorDialog;
