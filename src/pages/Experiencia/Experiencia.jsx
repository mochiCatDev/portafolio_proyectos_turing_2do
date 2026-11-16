import { useEffect, useRef, useState } from 'react';
import DivEstetica from '../../components/DivEstetica/DivEstetica';
import ReproductorMusica from '../../components/ReproductorMusica/ReproductorMusica';
import { escenas } from '../../data/escenas';
import './Experiencia.css';

const SEGUNDO_APERTURA = 9;
const ESPERA_INICIO = 6000;

function Experiencia() {
    const [mostrarEstanteria, setMostrarEstanteria] = useState(false);
    const [indiceEscena, setIndiceEscena] = useState(0);
    const [reproduciendo, setReproduciendo] = useState(false);
    const reproRef = useRef(false);
    const videoRef = useRef(null);
    const fondoImgRef = useRef(null);
    const reprodujoRef = useRef(false);
    const escenaActual = escenas[indiceEscena];

    useEffect(() => {
        reproRef.current = reproduciendo;
    }, [reproduciendo]);

    useEffect(() => {
        const temporizador = setTimeout(() => {
            if (!reprodujoRef.current) {
                setMostrarEstanteria(true);
            }
        }, ESPERA_INICIO);

        return () => clearTimeout(temporizador);
    }, []);

    // Forzar recarga del video cuando cambie el fondo o el tipo de fondo
    useEffect(() => {
        const video = videoRef.current;
        const img = fondoImgRef.current;

        if (escenaActual.tipoFondo === 'video' && video) {
            video.src = escenaActual.fondo;
            video.load();
            if (reproRef.current) {
                video.play().catch(() => {});
            }
        }
        if (escenaActual.tipoFondo === 'imagen' && img) {
            img.src = escenaActual.fondo;
        }
    }, [escenaActual]);

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
                    key={escenaActual.fondo}
                    ref={videoRef}
                    className="video-fondo"
                    src={escenaActual.fondo}
                    autoPlay
                    muted
                    playsInline
                    preload="metadata"
                    loop={!escenaActual.esIntro}
                    disablePictureInPicture
                    onTimeUpdate={manejarTiempo}
                    onEnded={() => {
                        setMostrarEstanteria(true);
                        if (escenaActual.esIntro) {
                            cambiarEscena((i) => (i + 1) % escenas.length);
                            setReproduciendo(true);
                        }
                    }}
                    onError={() => setMostrarEstanteria(true)}
                    onPlaying={() => { reprodujoRef.current = true; setReproduciendo(true); }}
                />
            ) : (
                <img
                    key={escenaActual.fondo}
                    ref={fondoImgRef}
                    className="video-fondo"
                    src={escenaActual.fondo}
                    alt="Fondo de escena"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            )}
            <div className="video-fundido"></div>

            {mostrarEstanteria && <DivEstetica indiceEscena={indiceEscena} />}
            <ReproductorMusica
                indiceActual={indiceEscena}
                onCambiarEscena={cambiarEscena}
                mostrar={mostrarEstanteria}
            />
        </main>
    );
}

export default Experiencia;
