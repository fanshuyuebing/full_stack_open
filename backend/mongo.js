const dns = require('dns')
dns.setServers(['223.5.5.5', '119.29.29.29'])

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = encodeURIComponent(process.argv[2])

const url = `mongodb+srv://fanshu:${password}@cluster0.4wcbymy.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

mongoose
  .connect(url, {
    family: 4,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log('connected to MongoDB')
    return Note.find({ important: true })
  })
  .then(notes => {
    notes.forEach(note => {
      console.log(note)
    })
    return mongoose.connection.close()
  })
  .catch(error => {
    console.log('error:', error.message)
    mongoose.connection.close()
  })