const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const config = require('../utils/config')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

mongoose.connect(config.MONGODB_URI)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('the correct number of blog posts is returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('the unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]
  assert.ok(blog.id)
  assert.strictEqual(blog._id, undefined)
  assert.strictEqual(blog.__v, undefined)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Async/Await patterns',
    author: 'John Doe',
    url: 'https://example.com/async-await',
    likes: 10,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map((b) => b.title)
  assert.ok(titles.includes('Async/Await patterns'))
})

test('a blog without likes defaults to 0', async () => {
  const newBlog = {
    title: 'Likes are optional',
    author: 'Jane Doe',
    url: 'https://example.com/no-likes',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('a blog without title returns 400', async () => {
  const newBlog = {
    author: 'No Title',
    url: 'https://example.com/no-title',
  }

  await api.post('/api/blogs').send(newBlog).expect(400)
})

test('a blog without url returns 400', async () => {
  const newBlog = {
    title: 'No URL',
    author: 'No URL Author',
  }

  await api.post('/api/blogs').send(newBlog).expect(400)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

  const ids = blogsAtEnd.map((b) => b.id)
  assert.ok(!ids.includes(blogToDelete.id))
})

test('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedData = { likes: 100 }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 100)
  assert.strictEqual(response.body.title, blogToUpdate.title)
})

after(async () => {
  await mongoose.connection.close()
})