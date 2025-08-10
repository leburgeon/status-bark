import { useEffect, useState } from 'react'
import { Box, Typography, Paper, Button, Stack, Fade } from '@mui/material'
import { useAppDispatch, useAppSelector } from "../../../hooks"
import Monitor from "./MonitorListItem"
import AddMonitorDialog from './AddMonitorDialog'
import DeleteMonitorDialog from './DeleteMonitorDialog'
import { createMonitor, initialiseMonitors, deleteMonitor, NewMonitorData, Monitor as MonitorType, sendMonitorPatchAndUpdateMonitor, sendWebhookPatchAndUpdateMonitor } from '../../../reducers/monitorsSlice'
import EditMonitorDialog from './EditMonitorDialog'
import AddOrUpdateWebhookDialog from './AddOrUpdateWebhookDialog'

const MonitorsList = () => {
  const monitors = useAppSelector(store => store.monitors.monitorsArray)

  const [newDialogOpen, setNewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [webhookDialogOpen, setWebhookDialogOpen] = useState(true)

  const [selectedMonitor, setSelectedMonitor] = useState<MonitorType | null>(null)
  const dispatch = useAppDispatch()

  // Variable for disabling some buttons when the browser is fetching
  const fetching = useAppSelector(store => store.ui.fetching)

  // For handling adding a new monitor
  const handleAddMonitor = (data: NewMonitorData) => {
    dispatch(createMonitor(data))
    setNewDialogOpen(false)
  }

  // Handles what happens when the delete icon is clicked, including opening the dialoge
  const handleDeleteClick = (monitor: MonitorType) => {
    setSelectedMonitor(monitor)
    setDeleteDialogOpen(true)
  }

  // Handles what happens when the deletion is complete
  const handleDeleteConfirm = () => {
    if (selectedMonitor) {
      dispatch(deleteMonitor(selectedMonitor.id))
    }
    setDeleteDialogOpen(false)
    setSelectedMonitor(null)
  }

  // Handles what happens when the edit button is pressed
  const handleEditClick = (monitor: MonitorType) => {
    setSelectedMonitor(monitor)
    setEditDialogOpen(true)
  }

  // Handles the submition of the edit for the monitor
  const handleSubmitEdit = (data: { url: string, interval: number, nickname: string }, id: string) => {
    dispatch(sendMonitorPatchAndUpdateMonitor(id, data))
    setEditDialogOpen(false)
    setSelectedMonitor(null)
  }

  // Handles submitting an edit for the webhook
  const handleSubmitWebhookEdit = (data: { unEncryptedWebhook: string | null }, id: string) => {
    dispatch(sendWebhookPatchAndUpdateMonitor(id, data))
    setWebhookDialogOpen(false)
    setEditDialogOpen(false)
    setSelectedMonitor(null)
  }

  useEffect(() => {
    dispatch(initialiseMonitors())
  }, [dispatch])

  return (

    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 6, mb: 4 }}>

      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(145deg, #141414, #1e1e1e)' }}>
        <Typography variant="h2" sx={{ mb: 3, textAlign: 'center', letterSpacing: 2, color: 'primary.main', fontWeight: 700 }}>
          MONITORS
        </Typography>
        <Stack spacing={2}>
          {monitors.length === 0 ? (
            <Typography color="text.secondary" align="center">No monitors yet. Add one below!</Typography>
          ) : (
            monitors.map(monitor => <Fade in key={monitor.id}><Box>
              <Monitor
                {...monitor}
                onDeleteClick={() => handleDeleteClick(monitor)}
                onEditClick={() => handleEditClick(monitor)}
                fetching={fetching}
              />
            </Box></Fade>)
          )}
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ minWidth: 200, fontSize: '1.1rem', boxShadow: '0 0 16px #ff2ec4' }}
            onClick={() => setNewDialogOpen(true)}
          >
            + Add Monitor
          </Button>
        </Box>
      </Paper>

      <AddMonitorDialog
        open={newDialogOpen}
        onClose={() => setNewDialogOpen(false)}
        onAdd={handleAddMonitor}
      />

      <DeleteMonitorDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        monitorNickname={selectedMonitor?.nickname || 'this monitor'}
      />

      <EditMonitorDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleSubmitEdit}
        selectedMonitor={selectedMonitor}
        openWebhookDialog={() => setWebhookDialogOpen(true)}
      />

      <AddOrUpdateWebhookDialog
        open={webhookDialogOpen}
        onClose={() => {
          setWebhookDialogOpen(false)
        }}
        selectedMonitor={selectedMonitor}
        onSubmit={handleSubmitWebhookEdit} />
    </Box>
  )
}

export default MonitorsList