import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography, Button, Link, Box, Divider } from '@mui/material'
import blogService from '../services/blogs'

const SingleBlog = ({ blogs, setBlogs, user }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)

  useEffect(() => {
    blogService.getOne(id).then(blog => {
      setBlog(blog)
    })
  }, [id])

  const handleLike = async () => {
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    setBlog(returnedBlog)
    setBlogs(blogs.map(b => b.id !== blog.id ? b : returnedBlog))
  }

  const handleDelete = async () => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      return
    }

    await blogService.remove(blog.id)
    setBlogs(blogs.filter(b => b.id !== blog.id))
    navigate('/')
  }

  if (!blog) {
    return null
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4">{blog.title}</Typography>
        <Typography variant="h6" sx={{ color: 'grey.600' }} gutterBottom>
          by {blog.author}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <Link href={blog.url} target="_blank" rel="noopener">{blog.url}</Link>
        </Typography>
        <Typography sx={{ color: 'grey.600', mb: 1 }}>
          added by {blog.user ? blog.user.name : 'unknown'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography>{blog.likes} likes</Typography>
          {user && (
            <Button size="small" variant="contained" onClick={handleLike}>like</Button>
          )}
          {user && blog.user && user.username === blog.user.username && (
            <Button size="small" variant="outlined" color="error" onClick={handleDelete}>
              remove
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default SingleBlog