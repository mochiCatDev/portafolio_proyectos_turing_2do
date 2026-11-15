import { Route, Routes } from 'react-router-dom'
import './App.css'
import Inicio from './pages/Inicio/Inicio'
import Experiencia from './pages/Experiencia/Experiencia'
import NoEncontrado from './pages/NoEncontrado/NoEncontrado'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Inicio />} />
        <Route path='/experiencia' element={<Experiencia />} />
        <Route path='*' element={<NoEncontrado />} />
      </Routes>
    </>
  )
}

export default App
