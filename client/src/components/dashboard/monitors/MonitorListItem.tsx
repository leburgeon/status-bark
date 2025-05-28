import { ListItem, Tooltip, ListItemButton, ListItemIcon, ListItemText, IconButton, Box } from "@mui/material"
import StatusIcon from './StatusIcon'
import { Monitor, deleteMonitor } from "../../../reducers/monitorsSlice"
import { DeleteOutlineOutlined } from "@mui/icons-material"
import { useState } from "react"
import DeleteMonitorDialog from "./DeleteMonitorDialog"
import { useAppDispatch } from "../../../hooks"

const MonitorListItem = ({id, nickname, url, interval, lastStatus, lastChecked}: Monitor) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    dispatch(deleteMonitor(id));
    setDialogOpen(false);
  };

  return (
    <>
      <ListItem>
        <ListItemIcon sx={{ minWidth: 36 }}>
          <StatusIcon lastStatus={lastStatus}/>
        </ListItemIcon>
        <Tooltip title={url}>
          <ListItemButton sx={{ px: 0.5, py: 0, minHeight: 48 }} disableGutters>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: 0, ml:'5px'}}>
              <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                <ListItemText
                  primary={<span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nickname}</span>}
                  secondary={<span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</span>}
                />
              </Box>
              <Box sx={{ flex: 'none', width: 120, pl: 0, textAlign: 'right' }}>
                <ListItemText
                  primary={<span style={{ display: 'block', whiteSpace: 'nowrap' }}>{`Every: ${interval} Min`}</span>}
                  secondary={<span style={{ display: 'block', whiteSpace: 'nowrap' }}>{`Last: ${new Date(lastChecked).toLocaleTimeString()}`}</span>}
                />
              </Box>
            </Box>
          </ListItemButton>
        </Tooltip>
        <IconButton onClick={() => setDialogOpen(true)}>
          <DeleteOutlineOutlined/>
        </IconButton>
      </ListItem>
      <DeleteMonitorDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleDelete}
        monitorNickname={nickname}
      />
    </>
  )
}

export default MonitorListItem