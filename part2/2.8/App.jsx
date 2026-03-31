import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1234567'}
  ]) 
  const [newPerson, setNewPerson] = useState({'name':'','number':''})

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


  return (
    <div>
      <h2>Phonebook</h2>
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
        {persons.map((person) => (<p key={person.name}>{person.name} {person.number}</p>))}
      </div>
    </div>
  )
}

export default App