import { useEffect, useRef, useState } from 'react';
import { escenas } from '../../data/escenas';
import './ReproductorMusica.css';

const COOLDOWN_MS = 5000;

export default function ReproductorMusica() {
    const [indiceActual, setIndiceActual] = useState(0);
    const [reproduciendo, setReproduciendo] = useState(false);
    const [bloqueado, setBloqueado] = useState(false);
    const audioRef = useRef(null);
    const cooldownRef = useRef(null);

    const escenaActual = escenas[indiceActual];

    const siguienteIndice = () => (indiceActual + 1) % escenas.length;
    const anteriorIndice = () => (indiceActual - 1 + escenas.length) % escenas.length;

    const cambiarEscena = (nuevoIndice, continuarReproduciendo = reproduciendo) => {
        setIndiceActual(nuevoIndice);
        setBloqueado(true);
        if (cooldownRef.current) clearTimeout(cooldownRef.current);
        cooldownRef.current = setTimeout(() => setBloqueado(false), COOLDOWN_MS);
        if (continuarReproduciendo) {
            setReproduciendo(true);
        }
    };

    const toggleReproduccion = async () => {
        const audio = audioRef.current;
        if (!audio || bloqueado) return;
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
        const audio = audioRef.current;
        if (!audio || !escenaActual?.audio) return;

        audio.src = escenaActual.audio;
        audio.load();

        const manejarFin = () => {
            // Si es intro, no repetir; pasar a la siguiente y no volver nunca
            if (escenaActual.esIntro) {
                setIndiceActual((i) => (i + 1) % escenas.length);
                setReproduciendo(true);
            } else {
                setIndiceActual((i) => (i + 1) % escenas.length);
                setReproduciendo(true);
            }
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
        <nav className="reproductor-musica" aria-label="Control de musica de fondo">
            <audio ref={audioRef} preload="auto" />
            <button
                className={`control-btn btn-atras ${bloqueado ? 'bloqueado' : ''}`}
                aria-label="Pista anterior"
                onClick={() => {
                    cambiarEscena(anteriorIndice(), true);
                    const audio = audioRef.current;
                    if (audio && reproduciendo) {
                        audio.play().catch(() => {});
                    }
                }}
                disabled={bloqueado}
            >
                <i className="fa-solid fa-step-backward"></i>
            </button>
            <button
                className={`control-btn btn-play-pause ${reproduciendo ? 'activo' : ''} ${bloqueado ? 'bloqueado' : ''}`}
                aria-label={reproduciendo ? 'Pausar' : 'Reproducir'}
                onClick={toggleReproduccion}
                disabled={bloqueado}
            >
                <i className={reproduciendo ? 'fa-solid fa-pause' : 'fa-solid fa-play'}></i>
            </button>
            <button
                className={`control-btn btn-adelante ${bloqueado ? 'bloqueado' : ''}`}
                aria-label="Pista siguiente"
                onClick={() => {
                    cambiarEscena(siguienteIndice(), true);
                    const audio = audioRef.current;
                    if (audio && reproduciendo) {
                        audio.play().catch(() => {});
                    }
                }}
                disabled={bloqueado}
            >
                <i className="fa-solid fa-step-forward"></i>
            </button>
        </nav>
    );
}
