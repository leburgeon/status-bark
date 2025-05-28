import { useEffect, useState } from 'react'
import { Box, Typography, Paper, Button, Stack, Fade } from '@mui/material'
import { useAppDispatch, useAppSelector } from "../../../hooks"
import Monitor from "./MonitorListItem"
import AddMonitorDialog from './AddMonitorDialog'
import DeleteMonitorDialog from './DeleteMonitorDialog'
import { createMonitor, initialiseMonitors, deleteMonitor, NewMonitorData, Monitor as MonitorType } from '../../../reducers/monitorsSlice'

const MonitorsList = () => {
  const monitors = useAppSelector(store => store.monitors.monitorsArray)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedMonitor, setSelectedMonitor] = useState<MonitorType | null>(null)
  const dispatch = useAppDispatch()

  const handleAddMonitor = (data: NewMonitorData) => {
    dispatch(createMonitor(data))
    setDialogOpen(false)
  }

  const handleDeleteClick = (monitor: MonitorType) => {
    setSelectedMonitor(monitor)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedMonitor) {
      dispatch(deleteMonitor(selectedMonitor.id))
    }
    setDeleteDialogOpen(false)
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
            onClick={() => setDialogOpen(true)}
          >
            + Add Monitor
          </Button>
        </Box>
      </Paper>
      <AddMonitorDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onAdd={handleAddMonitor} />
      <DeleteMonitorDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        monitorNickname={selectedMonitor?.nickname || ''}
      />
    </Box>
  )
}

export default MonitorsList