import { useEffect, useRef, useState } from 'react';
import Estanteria from '../../components/Estanteria/Estanteria';
import ReproductorMusica from '../../components/ReproductorMusica/ReproductorMusica';
import { escenas } from '../../data/escenas';
import './Experiencia.css';

const SEGUNDO_APERTURA = 9;
const ESPERA_INICIO = 6000;

function Experiencia() {
    const [mostrarEstanteria, setMostrarEstanteria] = useState(false);
    const [indiceEscena, setIndiceEscena] = useState(0);
    const videoRef = useRef(null);
    const fondoImgRef = useRef(null);
    const reprodujoRef = useRef(false);
    const escenaActual = escenas[indiceEscena];

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

    const cambiarEscena = (nuevoIndice) => {
        setIndiceEscena(nuevoIndice);
    };

    return (
        <main className="escena-oscura">
            {/* Fondo de pantalla: video o imagen segķn la escena actual */}
            {escenaActual.tipoFondo === 'video' ? (
                <video
                    ref={videoRef}
                    className="video-fondo"
                    src={escenaActual.fondo}
                    autoPlay
                    muted
                    playsInline
                    preload="metadata"
                    disablePictureInPicture
                    onTimeUpdate={manejarTiempo}
                    onEnded={() => {
                        setMostrarEstanteria(true);
                        if (escenaActual.esIntro) {
                            cambiarEscena((i) => (i + 1) % escenas.length);
                        }
                    }}
                    onError={() => setMostrarEstanteria(true)}
                    onPlaying={() => { reprodujoRef.current = true; }}
                />
            ) : (
                <img
                    ref={fondoImgRef}
                    className="video-fondo"
                    src={escenaActual.fondo}
                    alt="Fondo de escena"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            )}
            <div className="video-fundido"></div>

            {mostrarEstanteria && <Estanteria />}
            <ReproductorMusica />
        </main>
    );
}

export default Experiencia;
