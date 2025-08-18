import { ListItem, Tooltip, ListItemButton, ListItemIcon, ListItemText, IconButton, Box } from "@mui/material"
import StatusIcon from './StatusIcon'
import { Monitor } from "../../../reducers/monitorsSlice"
import { DeleteOutlineOutlined } from "@mui/icons-material"
import NotificationSwitch from "./NotificationSwitch"
import NotificationIcon from "./NotificationIcon"
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { useState } from "react"


// Add onDeleteClick prop to trigger delete dialog from parent
const MonitorListItem = ({ id, nickname, url, interval, lastStatus, lastChecked, discordWebhook, onDeleteClick, onEditClick, fetching }: Monitor & { onEditClick: () => void, onDeleteClick: () => void, fetching: boolean }) => {

  // For storing the state of the notify value for the list item for responsive ui change to the switch
  const [notifyState, setNotifyState] = useState(discordWebhook.notify)

  return (
    // enforce a sensible minimum width so internal components don't overlap
    <ListItem sx={{ alignItems: 'center', minWidth: 480 }}>
      <ListItemIcon sx={{ minWidth: 36 }}>
        <StatusIcon lastStatus={lastStatus} />
      </ListItemIcon>
      <Tooltip title={url}>
        {/* make button full width but allow inner text to truncate */}
        <ListItemButton sx={{ px: 0.5, py: 0, minHeight: 48, width: '100%', minWidth: 0 }} disableGutters>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: 0, ml: '5px' }}>
            <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <ListItemText
                primary={<span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nickname}</span>}
                secondary={<span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</span>}
              />
            </Box>
            {/* right metadata: keep a fixed minimum so it doesn't collapse */}
            <Box sx={{ flex: 'none', width: 140, minWidth: 140, pl: 0, textAlign: 'right' }}>
              <ListItemText
                primary={<span style={{ display: 'block', whiteSpace: 'nowrap' }}>{`Every: ${interval} Min`}</span>}
                secondary={<span style={{ display: 'block', whiteSpace: 'nowrap' }}>{lastStatus === 'NOTCHECKED' ? 'Not Checked' : `Last: ${new Date(lastChecked).toLocaleTimeString()}`}</span>}
              />
            </Box>
          </Box>
        </ListItemButton>
      </Tooltip>

      {/* keep switch and icons from shrinking and overlapping */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1, flexShrink: 0 }}>
        <NotificationSwitch fetching={fetching} id={id} discordWebhook={discordWebhook} notifyState={notifyState} setNotifyState={setNotifyState} />
        <ListItemIcon sx={{ minWidth: 36, flexShrink: 0 }}>
          <NotificationIcon notify={notifyState} />
        </ListItemIcon>
        <IconButton onClick={onEditClick} sx={{ ml: '-5px', flexShrink: 0 }}>
          <EditOutlinedIcon />
        </IconButton>
        <IconButton onClick={onDeleteClick} sx={{ flexShrink: 0 }}>
          <DeleteOutlineOutlined color="error" />
        </IconButton>
      </Box>
    </ListItem>
  )
}

export default MonitorListItem