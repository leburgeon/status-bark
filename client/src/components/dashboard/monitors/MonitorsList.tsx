import { useAppSelector } from "../../../hooks"
import Monitor from "./MonitorListItem"

const MonitorsList = () => {
  const monitors = useAppSelector(store => store.monitors.monitorsArray)

  return (
    <>
      {monitors.map(monitor => <Monitor 
        key={monitor.id}
        id={monitor.id}
        url={monitor.url}
        nickname={monitor.nickname}
        interval={monitor.interval}
        lastStatus={monitor.lastStatus}
        lastChecked={monitor.lastChecked}
        createdAt={monitor.createdAt}
        discordWebhook={monitor.discordWebhook}
         />)}
    </>
  )
}

export default MonitorsList