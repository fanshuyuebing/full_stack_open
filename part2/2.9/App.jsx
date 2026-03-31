import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newPerson, setNewPerson] = useState({'name':'','number':''})
  const [searchTerm,setSearchTerm] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const nameExists = persons.some(person => person.name === newPerson.name)
    
    if(nameExists){
      alert(`${newPerson.name} is already added to phonebook`)
      return
    }

    const nameObject = {
      name: newPerson.name,
      number: newPerson.number
    }

    setPersons(persons.concat(nameObject))
    setNewPerson({name: '', number: ''})
  }

  const handleNameChange = (event) => {
    setNewPerson({...newPerson, name: event.target.value})
  }
  
  const handleNumberChange = (event) => {
    setNewPerson({...newPerson, number: event.target.value})
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const personToShow = searchTerm === ''
    ? persons
    : persons.filter(person => 
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
      )

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <input value={searchTerm} onChange={handleSearchChange}/>
      </div>
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          <p>name: <input value={newPerson.name} onChange={handleNameChange}/></p>
          <p>nmber: <input value={newPerson.number} onChange={handleNumberChange}/></p>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {personToShow.map((person) => (<p key={person.name}>{person.name} {person.number}</p>))}
      </div>
    </div>
  )
}

export default App