import { Switch, Tooltip } from "@mui/material"
import { useAppDispatch } from "../../../hooks"
import { ChangeEvent } from "react"
import { sendWebhookPatchAndUpdateMonitor } from "../../../reducers/monitorsSlice"

const NotificationSwitch = ({discordWebhook, id, notifyState, setNotifyState, fetching}: {id: string, discordWebhook: {notify: boolean, urlPresent: boolean}, fetching: boolean, notifyState: boolean, setNotifyState: React.Dispatch<React.SetStateAction<boolean>>}) => {
  
  const dispatch = useAppDispatch()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNotifyState(!notifyState)
    dispatch(sendWebhookPatchAndUpdateMonitor(id, {notify: event.target.checked}))
  }

  return (
  <Tooltip title={discordWebhook.urlPresent ? '' : 'add a discord webhook in the settings'}>
    <span>
      <Switch 
        checked={notifyState}
        disabled={!discordWebhook.urlPresent || fetching}
        onChange={handleChange}/>
    </span>
  </Tooltip>)
}

export default NotificationSwitch