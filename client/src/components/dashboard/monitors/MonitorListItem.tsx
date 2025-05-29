import { ListItem, Tooltip, ListItemButton, ListItemIcon, ListItemText, IconButton, Box } from "@mui/material"
import StatusIcon from './StatusIcon'
import { Monitor } from "../../../reducers/monitorsSlice"
import { DeleteOutlineOutlined } from "@mui/icons-material"
import NotificationSwitch from "./NotificationSwitch"
import NotificationIcon from "./NotificationIcon"
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { useState } from "react"


// Add onDeleteClick prop to trigger delete dialog from parent
const MonitorListItem = ({ id, nickname, url, interval, lastStatus, lastChecked, discordWebhook, onDeleteClick, onEditClick, fetching}: Monitor & { onEditClick: () => void, onDeleteClick: () => void, fetching: boolean }) => {
  
  // For storing the state of the notify value for the list item for responsive ui change to the switch
  const [notifyState, setNotifyState] = useState(discordWebhook.notify)

  return (
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
                secondary={<span style={{ display: 'block', whiteSpace: 'nowrap' }}>{lastStatus === 'NOTCHECKED' ? 'Not Checked' : `Last: ${new Date(lastChecked).toLocaleTimeString()}`}</span>}
              />
            </Box>
          </Box>
        </ListItemButton>
      </Tooltip>

      <NotificationSwitch fetching={fetching} id={id} discordWebhook={discordWebhook} notifyState={notifyState} setNotifyState={setNotifyState} />
      <ListItemIcon sx={{ minWidth: 36 }}>
        <NotificationIcon notify={notifyState}/>
      </ListItemIcon>
      <IconButton onClick={onEditClick} sx={{ml: '-5px'}}>
        <EditOutlinedIcon color="secondary"/>
      </IconButton>
      <IconButton onClick={onDeleteClick}>
        <DeleteOutlineOutlined color="error"/>
      </IconButton>
    </ListItem>
  )
}

export default MonitorListItem