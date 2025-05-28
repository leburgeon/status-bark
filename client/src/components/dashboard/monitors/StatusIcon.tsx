import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Tooltip } from '@mui/material';

const StatusIcon = ({lastStatus} : {lastStatus: 'UP' | 'DOWN' | 'NOTCHECKED'}) => {
  return (<Tooltip title={lastStatus}>
    {lastStatus === 'UP'
    ? <CheckCircleOutlineIcon color="success" fontSize="large"/>
    : lastStatus === 'DOWN'
      ? <CancelOutlinedIcon sx={{color: 'orangered'}} color="primary" fontSize="large"/>
      : <MoreHorizIcon color="primary" fontSize='large' />}
  </Tooltip>)
}

export default StatusIcon