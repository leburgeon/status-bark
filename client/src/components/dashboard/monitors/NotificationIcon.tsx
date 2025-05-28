import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined"
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { Tooltip } from "@mui/material"

const NotificationIcon = ({notify} : {notify: boolean}) => {

  return (
    <Tooltip title={notify ? 'ON' : 'OFF'}>
      {notify
        ? <NotificationsActiveOutlinedIcon color="primary"/>
        : <NotificationsNoneOutlinedIcon color="disabled"/>}
    </Tooltip>
  )
}

export default NotificationIcon