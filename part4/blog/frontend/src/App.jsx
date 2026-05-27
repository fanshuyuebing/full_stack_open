import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationType, setNotificationType] = useState('error')
  const [errorMessage, setErrorMessage] = useState(null)

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
  }

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setErrorMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setNotificationType('success')
      setTimeout(() => setErrorMessage(null), 5000)
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

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} type="error" />
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} type={notificationType} />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="create new blog">
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} user={user} handleLike={() => handleLike(blog)} handleDelete={() => handleDelete(blog)} />
      )}
    </div>
  )
}

export default App