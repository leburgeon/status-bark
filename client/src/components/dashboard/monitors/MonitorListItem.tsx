import { ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Box } from "@mui/material"
import StatusIcon from './StatusIcon'
import NotificationIcon from "./NotificationIcon"
import NotificationSwitch from "./NotificationSwitch"
import { Monitor } from "../../../reducers/monitorsSlice"
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const MonitorListItem = ({nickname, url, interval, lastStatus, discordWebhook, lastChecked}: Monitor) => {
  return (
    <ListItem>
      <ListItemIcon sx={{ minWidth: 36 }}>
        <StatusIcon lastStatus={lastStatus}/>
      </ListItemIcon>
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
      <NotificationSwitch discordWebhook={discordWebhook} />
      <ListItemIcon sx={{ minWidth: 36 }}>
        <NotificationIcon notify={discordWebhook.notify}/>
      </ListItemIcon>
      <IconButton sx={{ml: '-5px'}}>
        <EditOutlinedIcon/>
      </IconButton>
    </ListItem>
  )
}

export default MonitorListItem