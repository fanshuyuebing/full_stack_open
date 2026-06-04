import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import NavBar from './components/NavBar'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import SingleBlog from './components/SingleBlog'
import Togglable from './components/Togglable'

const AppContent = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationType, setNotificationType] = useState('error')
  const [errorMessage, setErrorMessage] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      setErrorMessage('wrong credentials')
      setNotificationType('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async event => {
    event.preventDefault()

    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    setUsername('')
    setPassword('')
    navigate('/')
  }

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setErrorMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setNotificationType('success')
      setTimeout(() => setErrorMessage(null), 5000)
      navigate('/')
    } catch {
      setErrorMessage('failed to create blog')
      setNotificationType('error')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    setBlogs(blogs.map(b => b.id !== blog.id ? b : returnedBlog))
  }

  const handleDelete = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      return
    }

    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    } catch {
      setErrorMessage('failed to delete blog')
      setNotificationType('error')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  return (
    <div>
      <NavBar user={user} handleLogout={handleLogout} />
      <Notification message={errorMessage} type={notificationType} />

      <Routes>
        <Route path="/" element={
          <div>
            <h2>blogs</h2>
            {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
              <Blog key={blog.id} blog={blog} user={user} handleLike={() => handleLike(blog)} handleDelete={() => handleDelete(blog)} />
            )}
          </div>
        } />
        <Route path="/create" element={
          user
            ? (
              <div>
                <BlogForm createBlog={createBlog} />
              </div>
              )
            : <Navigate to="/login" replace />
        } />
        <Route path="/blogs/:id" element={<SingleBlog blogs={blogs} setBlogs={setBlogs} user={user} />} />
        <Route path="/login" element={
          user
            ? <Navigate to="/" replace />
            : (
              <div>
                <h2>Log in to application</h2>
                <LoginForm
                  handleLogin={handleLogin}
                  username={username}
                  password={password}
                  setUsername={setUsername}
                  setPassword={setPassword}
                />
              </div>
              )
        } />
      </Routes>
    </div>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App