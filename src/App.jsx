import { Route, Routes } from 'react-router-dom'
import './App.css'
import Inicio from './pages/Inicio/Inicio'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Inicio />} />
        <Route path='/experiencia' element={""} />
        
      </Routes>
    </>
  )
}

export default App
