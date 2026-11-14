import { useRef, useState } from 'react';
import Estanteria from '../../components/Estanteria/Estanteria';
import './Experiencia.css';

const SEGUNDO_APERTURA = 9;

function Experiencia() {
    const [mostrarEstanteria, setMostrarEstanteria] = useState(false);
    const videoRef = useRef(null);

    const manejarTiempo = () => {
        if (videoRef.current && videoRef.current.currentTime >= SEGUNDO_APERTURA) {
            setMostrarEstanteria(true);
        }
    };

    return (
        <main className="escena-oscura">
            <div className="escena">
                <video
                    ref={videoRef}
                    className="video-fondo"
                    src="/videos/fondo.mp4"
                    autoPlay
                    muted
                    playsInline
                    disablePictureInPicture
                    onTimeUpdate={manejarTiempo}
                    onEnded={() => setMostrarEstanteria(true)}
                />
                <div className="video-fundido"></div>
            </div>

            {mostrarEstanteria && <Estanteria />}
        </main>
    );
}

export default Experiencia;
