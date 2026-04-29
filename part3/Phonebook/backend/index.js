const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(express.static('dist'))

morgan.token('post-data', (request) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
  return ''
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :post-data')
)


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})


app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id',(request,response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body

  if(!name){
    return response.status(400).json({
      error: 'name is missing'
    })
  }

  if(!number){
    return response.status(400).json({
      error: 'number is missing'
    })
  }

  const nameExists = persons.some(person => person.name === name)

  if(nameExists){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const newPerson = {
    id: String(Math.floor(Math.random() * 1000000)),
    name,
    number
  }

  persons = persons.concat(newPerson)

  response.json(newPerson)
})


app.get('/info', (request, response) => {
  const requestTime = new Date()
  const peopleCount = persons.length

  response.send(`
    <p>Phonebook has info for ${peopleCount} people</p>
    <p>${requestTime}</p>
  `)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})