// src/App.jsx

const Header = ({ course }) => <h1>{course.name}</h1>

const Part = ({ part }) => (
  <p>{part.name} {part.exercises}</p>
)

const Content = ({ course }) => {
  const [p1, p2, p3] = course.parts
  return (
    <div>
      <Part part={p1} />
      <Part part={p2} />
      <Part part={p3} />
    </div>
  )
}

const Total = ({ course }) => {
  const [p1, p2, p3] = course.parts
  return <p>Number of exercises {p1.exercises + p2.exercises + p3.exercises}</p>
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      { name: 'Fundamentals of React', exercises: 10 },
      { name: 'Using props to pass data', exercises: 7 },
      { name: 'State of a component', exercises: 14 }
    ]
  }

  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

export default App