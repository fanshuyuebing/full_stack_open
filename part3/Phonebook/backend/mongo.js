const dns = require('dns')
dns.setServers(['223.5.5.5', '119.29.29.29'])

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = encodeURIComponent(process.argv[2])

const url = `mongodb+srv://fanshu:${password}@cluster0.4wcbymy.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose
  .connect(url, {
    family: 4,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    if (process.argv.length === 3) {
      return Person.find({}).then(persons => {
        console.log('phonebook:')
        persons.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
      })
    }
    if (process.argv.length === 5) {
      const name = process.argv[3]
      const number = process.argv[4]
      const person = new Person({
        name,
        number,
      })
      return person.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`)
      })
    }
  })
  .then(() => {
    return mongoose.connection.close()
  })
  .catch(error => {
    console.log('error:', error.message)
    mongoose.connection.close()
  })