const dns = require('dns')
dns.setServers(['10.250.243.10'])

const express = require('express')
const blogRouter = require('./controllers/blog')
const usersRouter = require('./controllers/user')
const middleware = require('./utils/middleware')

const app = express()

app.use(express.json())
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)

app.use(middleware.errorHandler)

module.exports = app