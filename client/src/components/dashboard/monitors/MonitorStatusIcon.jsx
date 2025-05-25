import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Tooltip } from '@mui/material';

const MonitorStatusIcon = ({lastStatus}) => {
  return (<Tooltip title={lastStatus}>
    {lastStatus === 'UP'
    ? <CheckCircleOutlineIcon color="success" fontSize="large"/>
    : lastStatus === 'DOWN'
      ? <CancelOutlinedIcon sx={{color: 'orangered'}} color="primary" fontSize="large"/>
      : <MoreHorizIcon label color="primary" fontSize='large' />}
  </Tooltip>)
}

export default MonitorStatusIcon