import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Inicio.css';
import { mensajeInicio } from "../../data/mensajesSencillos";

function Inicio() {
    const [porcentajeRecursos, setPorcentajeRecursos] = useState(100);
    const [recursosCargados, setRecursosCargados] = useState(true);
    const navigate = useNavigate();
    const manejarButtonIngresar = () => navigate('hola');

    return (
        <div className="inicio">
            <h1>Mi Portafolio Personal</h1>
            {mensajeInicio.map((mensaje, index) => (
                <p key={index}>{mensaje}</p>
            ))}
            
            <div 
                className='porcentaje-recursos'
                style={{ color: porcentajeRecursos >= 100 ? 'green' : 'inherit' }}
            >
                <span>{porcentajeRecursos}</span>/100
            </div>

            <button
                disabled={!recursosCargados}
                onClick={manejarButtonIngresar}
            >
                Ingresar
            </button>
        </div>
    );
}

export default Inicio;