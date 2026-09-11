import { useState } from 'react'
import ScoreBoard from './components/ScoreBoard'
import UserForm from './components/UserForm'
import DataFetcher from './components/DataFetcher'
import LiveClock from './components/LiveClock'

function App() {
  const [count, setCount] = useState(0)
  const [showTimer, setShowTimer] = useState(true)

  return (
    <div className="app-container">
      <h1>Tutorial 4: State and Effects</h1>
      <ScoreBoard />
      <UserForm />
      <DataFetcher />

      <button
        className="btn-toggle"
        onClick={() => setShowTimer(!showTimer)}
      >
        {showTimer ? 'Hide Timer' : 'Show Timer'}
      </button>

      {showTimer && <LiveClock />}
    </div>
  )
}

export default App