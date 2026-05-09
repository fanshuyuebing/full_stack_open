const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  return blogs.reduce((fav, blog) => blog.likes > fav.likes ? blog : fav)
}

const _ = require('lodash')

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const counts = _.countBy(blogs, 'author')
  const author = _.maxBy(Object.keys(counts), (key) => counts[key])
  return {
    author: author,
    blogs: counts[author]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const likesByAuthor = _.mapValues(_.groupBy(blogs, 'author'), (authorBlogs) =>
    _.sumBy(authorBlogs, 'likes')
  )
  const author = _.maxBy(Object.keys(likesByAuthor), (key) => likesByAuthor[key])
  return {
    author: author,
    likes: likesByAuthor[author]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
