import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Inicio.css';
import { mensajeInicio } from "../../data/mensajesSencillos";
import MaquinaDeEscribir from "../../components/MaquinaDeEscribirMultiple/MaquinaDeEscribirMultiple";

function Inicio() {
    const [porcentajeRecursos, setPorcentajeRecursos] = useState(100);
    const [recursosCargados, setRecursosCargados] = useState(true);
    const navigate = useNavigate();
    const manejarButtonIngresar = () => navigate('/experiencia');

    return (
        <div className="inicio">
            <div className="contenido">

                <h1>Mi Portafolio Personal</h1>
                <MaquinaDeEscribir mensajes={mensajeInicio} velocidad={80} tiempoPausa={1000} bucle/>

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

            <img src="/src/assets/inicio/chica.png" className="imagen" />
        </div>
    );
}

export default Inicio;