import { useState } from 'react'
import { Box, Typography, Paper, Button, Stack, Fade } from '@mui/material'
import { useAppSelector } from "../../../hooks"
import Monitor from "./MonitorListItem"
import AddMonitorDialog from './AddMonitorDialog'
import { NewMonitorData } from '../../../reducers/monitorsSlice'

const MonitorsList = () => {
  const monitors = useAppSelector(store => store.monitors.monitorsArray)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Placeholder for add monitor logic
  const handleAddMonitor = (data: NewMonitorData) => {
    
    setDialogOpen(false)
  }

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
                id={monitor.id}
                url={monitor.url}
                nickname={monitor.nickname}
                interval={monitor.interval}
                lastStatus={monitor.lastStatus}
                lastChecked={monitor.lastChecked}
                createdAt={monitor.createdAt}
                discordWebhook={monitor.discordWebhook}
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
    </Box>
  )
}

export default MonitorsList