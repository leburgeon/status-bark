import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, IconButton } from "@mui/material"
import StatusIcon from './StatusIcon'
import NotificationIcon from "./NotificationIcon"
import NotificationSwitch from "./NotificationSwitch"
import { Monitor } from "../../../reducers/monitorsSlice"
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const MonitorListItem = ({nickname, url, interval, lastStatus, discordWebhook, lastChecked}: Monitor) => {
  return (
    <ListItem>
      <ListItemIcon>
        <StatusIcon lastStatus={lastStatus}/>
      </ListItemIcon>
      <ListItemButton>
        <ListItemText primary={nickname} secondary={url}/>
        <ListItemText primary={`Every: ${interval} Min`} secondary={`Last: ${new Date(lastChecked).toLocaleTimeString()}`}/>
      </ListItemButton>
      <Tooltip title>
        <NotificationSwitch discordWebhook={discordWebhook} />
      </Tooltip>
      <ListItemIcon>
        <NotificationIcon notify={discordWebhook.notify}/>
      </ListItemIcon>
      <IconButton>
        <EditOutlinedIcon/>
      </IconButton>
    </ListItem>
  )
}

export default MonitorListItem