const assert = require('node:assert')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const config = require('../utils/config')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

mongoose.connect(config.MONGODB_URI)

describe('when there is initially some blogs saved', () => {
  let token

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'blogger', passwordHash })
    await user.save()

    const userForToken = { username: user.username, id: user._id }
    token = jwt.sign(userForToken, process.env.SECRET)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map((b) => b.title)
    assert(titles.includes('React patterns'))
  })

  test('the unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]

    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
    assert.strictEqual(blog.__v, undefined)
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'Async/Await patterns',
        author: 'John Doe',
        url: 'https://example.com/async-await',
        likes: 10,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map((b) => b.title)
      assert(titles.includes('Async/Await patterns'))
    })

    test('likes defaults to 0 if missing', async () => {
      const newBlog = {
        title: 'Likes are optional',
        author: 'Jane Doe',
        url: 'https://example.com/no-likes',
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)
    })

    test('fails with status code 400 if title is missing', async () => {
      const newBlog = {
        author: 'No Title',
        url: 'https://example.com/no-title',
      }

      await api.post('/api/blogs').send(newBlog).expect(400)
    })

    test('fails with status code 400 if url is missing', async () => {
      const newBlog = {
        title: 'No URL',
        author: 'No URL Author',
      }

      await api.post('/api/blogs').send(newBlog).expect(400)
    })

    test('fails with status code 401 if token is missing', async () => {
      const newBlog = {
        title: 'Valid Title',
        author: 'Author',
        url: 'https://example.com/valid',
        likes: 3,
      }

      await api.post('/api/blogs').send(newBlog).expect(401)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if token matches creator', async () => {
      const newBlog = {
        title: 'Blog to delete',
        author: 'Creator',
        url: 'https://example.com/delete-me',
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token)
        .send(newBlog)
        .expect(201)

      const blogsAtStart = await helper.blogsInDb()

      await api
        .delete(`/api/blogs/${response.body.id}`)
        .set('Authorization', 'Bearer ' + token)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

      const ids = blogsAtEnd.map((b) => b.id)
      assert(!ids.includes(response.body.id))
    })

    test('fails with status code 401 if token is missing', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401)
    })
  })

  describe('updating a blog', () => {
    test('succeeds with valid data', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ likes: 100 })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 100)
      assert.strictEqual(response.body.title, blogToUpdate.title)
    })
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with 400 if username is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'No Username',
      password: 'password',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('username and password are required'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with 400 if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'nopassword',
      name: 'No Password',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('username and password are required'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with 400 if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ab',
      name: 'Short Name',
      password: 'goodpassword',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('at least 3 characters'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with 400 if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'validuser',
      name: 'Short Pass',
      password: 'pw',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('at least 3 characters'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})