import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'


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

const Person = ({ person,deletePerson }) => {
  return <div>
    <p>{person.name} {person.number} <button onClick={deletePerson}>delete</button></p>
    
  </div>
}

const Persons = ({ personsToShow, deletePerson }) => {
  return (
    <div>
      {personsToShow.map((person) => (
        <Person key={person.id} person={person} deletePerson={() => deletePerson(person.id, person.name)} />
      ))}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newPerson, setNewPerson] = useState({'name':'','number':''})
  const [searchTerm,setSearchTerm] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)

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
      if (!window.confirm(`${newPerson.name} 
          is already added to phonebook, 
          replace the old number with new one?`)) {
        return
      }

      const person = persons.find(n => n.name === newPerson.name)
      const changedPerson = {...person, number: newPerson.number}

      personService
        .update(person.id, changedPerson)
        .then(returnPerson =>{
          setPersons(persons.map(n => n.id === person.id ? returnPerson : n))
          setNewPerson({name: '', number: ''})
          setSuccessMessage(`Added ${person.name}`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
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
            setSuccessMessage(`Added ${returnedPerson.name}`)
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
          })
  }

  const deletePersonOf = (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) {
      return
    }

    personService
      .deletePerson(id)
      .then(() => {
        setPersons(persons.filter(n => n.id !== id))
      })
      .catch(error => {
        alert('Delete failed:', error)
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
      <Notification message={successMessage} />
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
      <Persons personsToShow={personToShow} deletePerson={deletePersonOf}/>
    </div>
  )
}

export default App