import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import RegistrationForm from './componentes/RegistrationForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Bienvenido</h1>
      <h3>Favor de compartir sus datos para crear su registro</h3>
      <RegistrationForm/>
    </>
  )
}

export default App
