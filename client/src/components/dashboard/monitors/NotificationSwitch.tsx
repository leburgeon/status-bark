import { Switch, Tooltip } from "@mui/material"

const NotificationSwitch = ({discordWebhook}: {discordWebhook: {notify: boolean, urlPresent: boolean}}) => {
  return (<Tooltip title={discordWebhook.urlPresent ? '' : 'cant notify without a webhook'}>
    <span><Switch checked={discordWebhook.notify} disabled={!discordWebhook.urlPresent}/></span>
  </Tooltip>)
}

export default NotificationSwitch