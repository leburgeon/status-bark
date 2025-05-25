import { ListItem, ListItemAvatar } from "@mui/material"
import MonitorStatusIcon from './MonitorStatusIcon'

const Monitor = ({nickname, interval, lastStatus, discordWebhook, lastChecked, createdAt, id}) => {
  return (
    <ListItem>
      <ListItemAvatar>
        <MonitorStatusIcon lastStatus={lastStatus}/>
      </ListItemAvatar>
    </ListItem>
  )
}

export default Monitor