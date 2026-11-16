import { useEffect, useRef, useState } from 'react';
import { pistasMusica } from '../../data/musica';
import './ReproductorMusica.css';

export default function ReproductorMusica() {
    const [indiceActual, setIndiceActual] = useState(0);
    const [reproduciendo, setReproduciendo] = useState(false);
    const [autoplayBloqueado, setAutoplayBloqueado] = useState(false);
    const [errorPista, setErrorPista] = useState(null);
    const audioRef = useRef(null);

    const pistaActual = pistasMusica[indiceActual];

    const siguienteIndice = () => (indiceActual + 1) % pistasMusica.length;
    const anteriorIndice = () => (indiceActual - 1 + pistasMusica.length) % pistasMusica.length;

    const cambiarPista = (nuevoIndice, continuarReproduciendo = reproduciendo) => {
        setIndiceActual(nuevoIndice);
        setErrorPista(null);
        if (continuarReproduciendo) {
            setReproduciendo(true);
        }
    };

    const toggleReproduccion = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        try {
            if (reproduciendo) {
                audio.pause();
                setReproduciendo(false);
            } else {
                await audio.play();
                setReproduciendo(true);
                setAutoplayBloqueado(false);
                setErrorPista(null);
            }
        } catch {
            setReproduciendo(false);
            setAutoplayBloqueado(true);
        }
    };

    const intentoAutoplayInicial = async () => {
        const audio = audioRef.current;
        if (!audio) return;
        try {
            await audio.play();
            setReproduciendo(true);
            setErrorPista(null);
        } catch {
            setReproduciendo(false);
            setAutoplayBloqueado(true);
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !pistaActual?.url) return;

        audio.src = pistaActual.url;
        audio.load();

        const manejarFin = () => {
            setIndiceActual((i) => (i + 1) % pistasMusica.length);
            setReproduciendo(true);
            setErrorPista(null);
        };

        const manejarError = () => {
            setErrorPista(pistaActual?.titulo || 'Pista');
            setIndiceActual((i) => (i + 1) % pistasMusica.length);
            setReproduciendo(true);
        };

        audio.addEventListener('ended', manejarFin);
        audio.addEventListener('error', manejarError);

        intentoAutoplayInicial();

        return () => {
            audio.removeEventListener('ended', manejarFin);
            audio.removeEventListener('error', manejarError);
        };
    }, [pistaActual]);

    return (
        <nav className="reproductor-musica" aria-label="Control de musica de fondo">
            <audio ref={audioRef} preload="auto" />
            {errorPista && (
                <span className="mensaje-error">
                    No se pudo reproducir: {errorPista}
                </span>
            )}
            <button
                className="control-btn btn-atras"
                aria-label="Pista anterior"
                onClick={() => {
                    cambiarPista(anteriorIndice(), true);
                    const audio = audioRef.current;
                    if (audio && reproduciendo) {
                        audio.play().catch(() => {});
                    }
                }}
            >
                <i className="fa-solid fa-step-backward"></i>
            </button>
            <button
                className={`control-btn btn-play-pause ${reproduciendo ? 'activo' : ''} ${autoplayBloqueado ? 'bloqueado' : ''}`}
                aria-label={reproduciendo ? 'Pausar' : 'Reproducir'}
                onClick={toggleReproduccion}
            >
                <i className={reproduciendo ? 'fa-solid fa-pause' : 'fa-solid fa-play'}></i>
            </button>
            <button
                className="control-btn btn-adelante"
                aria-label="Pista siguiente"
                onClick={() => {
                    cambiarPista(siguienteIndice(), true);
                    const audio = audioRef.current;
                    if (audio && reproduciendo) {
                        audio.play().catch(() => {});
                    }
                }}
            >
                <i className="fa-solid fa-step-forward"></i>
            </button>
            <span className="pista-actual">
                {pistaActual
                    ? `${pistaActual.titulo} (${indiceActual + 1} de ${pistasMusica.length})`
                    : 'Sin musica'}
            </span>
        </nav>
    );
}
