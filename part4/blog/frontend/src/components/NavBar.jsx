import { Link } from 'react-router-dom'
import { AppBar, Toolbar, Button, Typography } from '@mui/material'

const NavBar = ({ user, handleLogout }) => {
  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
          Blog App
        </Typography>
        <Button color="inherit" component={Link} to="/">blogs</Button>
        {user
          ? (
            <>
              <Button color="inherit" component={Link} to="/create">create new</Button>
              <Button color="inherit" onClick={handleLogout}>logout</Button>
            </>
            )
          : (
            <Button color="inherit" component={Link} to="/login">login</Button>
            )
        }
      </Toolbar>
    </AppBar>
  )
}

export default NavBar