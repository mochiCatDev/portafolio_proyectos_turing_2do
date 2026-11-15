import { useEffect, useRef, useState } from 'react';
import Estanteria from '../../components/Estanteria/Estanteria';
import './Experiencia.css';

const SEGUNDO_APERTURA = 9;
const ESPERA_INICIO = 6000;

function Experiencia() {
    const [mostrarEstanteria, setMostrarEstanteria] = useState(false);
    const videoRef = useRef(null);
    const reprodujoRef = useRef(false);

    useEffect(() => {
        const temporizador = setTimeout(() => {
            if (!reprodujoRef.current) {
                setMostrarEstanteria(true);
            }
        }, ESPERA_INICIO);

        return () => clearTimeout(temporizador);
    }, []);

    const manejarTiempo = () => {
        if (mostrarEstanteria) return;
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
                    onError={() => setMostrarEstanteria(true)}
                    onPlaying={() => { reprodujoRef.current = true; }}
                />
                <div className="video-fundido"></div>
            </div>

            {mostrarEstanteria && <Estanteria />}
        </main>
    );
}

export default Experiencia;
