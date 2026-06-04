import { TextField, Button, Box } from '@mui/material'

const LoginForm = ({ handleLogin, username, password, setUsername, setPassword }) => (
  <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
    <TextField
      label="username"
      value={username}
      onChange={({ target }) => setUsername(target.value)}
    />
    <TextField
      label="password"
      type="password"
      value={password}
      onChange={({ target }) => setPassword(target.value)}
    />
    <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>
      login
    </Button>
  </Box>
)

export default LoginForm