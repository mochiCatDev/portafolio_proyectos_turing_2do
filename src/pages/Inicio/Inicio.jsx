import { useState } from "react"
import { useNavigate } from "react-router-dom";
import './Inicio.css';

function Inicio() {
    const [porcentajeRecursos, setPorcentajeRecursos] = useState(0);
    const [recursosCargados, setRecursosCargados] = useState(true);
    const navigate = useNavigate();
    const manejarButtonIngresar = () => navigate('hola');

    return (
        <div className="inicio">
            <div><span>{porcentajeRecursos}</span>/100
            </div>
            <button
                disabled={!recursosCargados}
                onClick={manejarButtonIngresar}
            >ingresar</button>
        </div>
    )
}

export default Inicio
