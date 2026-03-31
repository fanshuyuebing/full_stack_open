import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'


const Filter = ({ searchTerm, handleSearchChange }) => {
  return (
    <div>
      filter shown with <input value={searchTerm} onChange={handleSearchChange}/>
    </div>
  )
}

const PersonForm = ({ 
  newPerson, 
  handleNameChange, 
  handleNumberChange, 
  addPerson 
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newPerson.name} onChange={handleNameChange}/>
      </div>
      <div>
        number: <input value={newPerson.number} onChange={handleNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = ({ person }) => {
  return <p>{person.name} {person.number}</p>
}

const Persons = ({ personsToShow }) => {
  return (
    <div>
      {personsToShow.map((person) => (
        <Person key={person.name} person={person} />
      ))}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newPerson, setNewPerson] = useState({'name':'','number':''})
  const [searchTerm,setSearchTerm] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])


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

    personService
          .create(nameObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setNewPerson({name: '', number: ''})
          })
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
        <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange}/>
      </div>
      <h2>add a new</h2>
      <PersonForm 
        newPerson={newPerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />

      <h2>Numbers</h2>
      <Persons personsToShow={personToShow} />
    </div>
  )
}

export default App