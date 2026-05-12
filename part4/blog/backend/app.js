const dns = require('dns')
dns.setServers(['10.250.243.10'])

const express = require('express')
const blogRouter = require('./controllers/blog')

const app = express()

app.use(express.json())

app.use('/api/blogs', blogRouter)

module.exports = app