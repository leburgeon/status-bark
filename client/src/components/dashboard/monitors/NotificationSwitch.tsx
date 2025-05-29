import { Switch, Tooltip } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { ChangeEvent } from "react"
import { sendWebhookPatchAndUpdateMonitor } from "../../../reducers/monitorsSlice"

const NotificationSwitch = ({discordWebhook, id, notifyState, setNotifyState}: {id: string, discordWebhook: {notify: boolean, urlPresent: boolean}, notifyState: boolean, setNotifyState: React.Dispatch<React.SetStateAction<boolean>>}) => {
  
  const dispatch = useAppDispatch()
  const fetching = useAppSelector(store => store.ui.fetching)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNotifyState(!notifyState)
    dispatch(sendWebhookPatchAndUpdateMonitor(id, {notify: event.target.checked}))
  }

  return (
  <Tooltip title={discordWebhook.urlPresent ? '' : 'cant notify without a webhook'}>
    <span>
      <Switch 
        checked={notifyState}
        disabled={!discordWebhook.urlPresent || fetching}
        onChange={handleChange}/>
    </span>
  </Tooltip>)
}

export default NotificationSwitch