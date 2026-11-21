import { Route, Routes } from 'react-router-dom'
import AvisoMovil from './components/AvisoMovil/AvisoMovil'
import Inicio from './pages/Inicio/Inicio'
import Experiencia from './pages/Experiencia/Experiencia'
import NoEncontrado from './pages/NoEncontrado/NoEncontrado'

function App() {
  return (
    <AvisoMovil>
      <Routes>
        <Route path='/' element={<Inicio />} />
        <Route path='/experiencia' element={<Experiencia />} />
        <Route path='*' element={<NoEncontrado />} />
      </Routes>
    </AvisoMovil>
  )
}

export default App
