import { Alert } from '@mui/material'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <Alert severity={type === 'error' ? 'error' : 'success'} sx={{ mb: 2 }}>
      {message}
    </Alert>
  )
}

export default Notification