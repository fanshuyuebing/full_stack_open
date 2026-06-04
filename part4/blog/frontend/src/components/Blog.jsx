import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Card, CardContent, Typography, Button, Link, Box } from '@mui/material'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  return (
    <Card sx={{ mb: 1 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Link component={RouterLink} to={`/blogs/${blog.id}`} underline="hover" sx={{ flexGrow: 1 }}>
            <Typography component="span" className="blog-title" sx={{ fontWeight: 'bold' }}>{blog.title}</Typography>
            {' '}
            <Typography component="span" className="blog-author" color="text.secondary">{blog.author}</Typography>
          </Link>
          <Button size="small" onClick={toggleDetails}>
            {showDetails ? 'hide' : 'view'}
          </Button>
        </Box>
        {showDetails && (
          <Box className="blog-details" sx={{ mt: 1 }}>
            <Typography className="blog-url">
              <Link href={blog.url} target="_blank" rel="noopener">{blog.url}</Link>
            </Typography>
            <Box className="blog-likes" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Typography>likes {blog.likes}</Typography>
              {user && <Button size="small" variant="outlined" onClick={handleLike}>like</Button>}
            </Box>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {blog.user ? blog.user.name : ''}
            </Typography>
            {user && blog.user && user.username === blog.user.username && (
              <Button size="small" variant="outlined" color="error" onClick={handleDelete} sx={{ mt: 0.5 }}>
                remove
              </Button>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default Blog