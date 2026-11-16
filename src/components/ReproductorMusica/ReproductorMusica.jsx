import { useEffect, useRef, useState } from 'react';
import { escenas } from '../../data/escenas';
import './ReproductorMusica.css';

const COOLDOWN_MS = 5000;

export default function ReproductorMusica({ indiceActual, onCambiarEscena, mostrar = true }) {
    const [reproduciendo, setReproduciendo] = useState(false);
    const [bloqueado, setBloqueado] = useState(false);
    const audioRef = useRef(null);
    const cooldownRef = useRef(null);
    const avanzarRef = useRef(null);

    const escenaActual = escenas[indiceActual];

    const siguienteIndice = () => (indiceActual + 1) % escenas.length;
    const anteriorIndice = () => (indiceActual - 1 + escenas.length) % escenas.length;
    const cambioBloqueado = bloqueado || !mostrar;

    const cambiarEscena = (nuevoIndice, continuarReproduciendo = reproduciendo) => {
        onCambiarEscena(nuevoIndice);
        setBloqueado(true);
        if (cooldownRef.current) clearTimeout(cooldownRef.current);
        cooldownRef.current = setTimeout(() => setBloqueado(false), COOLDOWN_MS);
        if (continuarReproduciendo) {
            setReproduciendo(true);
        }
    };

    const toggleReproduccion = async () => {
        const audio = audioRef.current;
        if (!audio || !mostrar) return;
        try {
            if (reproduciendo) {
                audio.pause();
                setReproduciendo(false);
            } else {
                await audio.play();
                setReproduciendo(true);
            }
        } catch {
            setReproduciendo(false);
        }
    };

    const intentoAutoplayInicial = async () => {
        const audio = audioRef.current;
        if (!audio) return;
        try {
            await audio.play();
            setReproduciendo(true);
        } catch {
            setReproduciendo(false);
        }
    };

    useEffect(() => {
        avanzarRef.current = () => {
            onCambiarEscena((indiceActual + 1) % escenas.length);
        };
    }, [indiceActual, onCambiarEscena]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !escenaActual?.audio) return;

        audio.src = escenaActual.audio;
        audio.load();

        const manejarFin = () => {
            avanzarRef.current?.();
            setReproduciendo(true);
        };

        audio.addEventListener('ended', manejarFin);

        intentoAutoplayInicial();

        return () => {
            audio.removeEventListener('ended', manejarFin);
            audio.pause();
            audio.src = '';
        };
    }, [escenaActual]);

    return (
        <nav className={`reproductor-musica ${mostrar ? 'visible' : ''}`} aria-label="Control de musica de fondo">
            <audio ref={audioRef} preload="auto" />
            <button
                className={`control-btn btn-atras ${cambioBloqueado ? 'bloqueado' : ''}`}
                aria-label="Pista anterior"
                onClick={() => {
                    if (cambioBloqueado) return;
                    cambiarEscena(anteriorIndice(), true);
                    const audio = audioRef.current;
                    if (audio && reproduciendo) {
                        audio.play().catch(() => {});
                    }
                }}
                disabled={cambioBloqueado}
            >
                <i className="fa-solid fa-step-backward"></i>
            </button>
            <button
                className={`control-btn btn-play-pause ${reproduciendo ? 'activo' : ''} ${cambioBloqueado ? 'bloqueado' : ''}`}
                aria-label={reproduciendo ? 'Pausar' : 'Reproducir'}
                onClick={toggleReproduccion}
                disabled={!mostrar}
            >
                <i className={reproduciendo ? 'fa-solid fa-pause' : 'fa-solid fa-play'}></i>
            </button>
            <button
                className={`control-btn btn-adelante ${cambioBloqueado ? 'bloqueado' : ''}`}
                aria-label="Pista siguiente"
                onClick={() => {
                    if (cambioBloqueado) return;
                    cambiarEscena(siguienteIndice(), true);
                    const audio = audioRef.current;
                    if (audio && reproduciendo) {
                        audio.play().catch(() => {});
                    }
                }}
                disabled={cambioBloqueado}
            >
                <i className="fa-solid fa-step-forward"></i>
            </button>
        </nav>
    );
}
