import {useCounterControls} from '../store/feedbackStore.js'

const Buttons = () => {
  const { setGood, setNeutral, setBad } = useCounterControls()

  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={setGood}>good</button>
      <button onClick={setNeutral}>neutral</button>
      <button onClick={setBad}>bad</button>
    </div>
  )
}

export default Buttons
