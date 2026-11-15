import { useNavigate } from "react-router-dom";
import './Inicio.css';
import { mensajeInicio } from "../../data/mensajesSencillos";
import MaquinaDeEscribir from "../../components/MaquinaDeEscribirMultiple/MaquinaDeEscribirMultiple";
import { usePrecarga } from "../../hooks/usePrecarga";
import chica from "../../assets/inicio/chica.png";

const RECURSOS = [chica, '/videos/fondo.mp4'];

function Inicio() {
    const { porcentaje, completo } = usePrecarga(RECURSOS);
    const navigate = useNavigate();
    const manejarButtonIngresar = () => navigate('/experiencia');

    return (
        <div className="inicio">
            <div className="contenido">

                <h1>Mi Portafolio Personal</h1>
                <MaquinaDeEscribir mensajes={mensajeInicio} velocidad={80} tiempoPausa={1000} bucle/>

                <div
                    className='porcentaje-recursos'
                    style={{ color: completo ? 'green' : 'inherit' }}
                >
                    <span>{porcentaje}</span>/100
                </div>

                <button
                    disabled={!completo}
                    onClick={manejarButtonIngresar}
                >
                    Ingresar
                </button>
            </div>

            <img src={chica} className="imagen" />
        </div>
    );
}

export default Inicio;
