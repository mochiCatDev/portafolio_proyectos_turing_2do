import { useEffect, useState } from 'react';

const TIEMPO_MAXIMO = 15000; // ms antes de dar el recurso por terminado

function cargarRecurso(url) {
    return new Promise((resolve) => {
        const esAudio = /\.(mp3|wav|ogg|aac|m4a)$/i.test(url);
        const esVideo = /\.(mp4|webm)$/i.test(url);

        let elemento;

        if (esAudio) {
            elemento = new Audio();
            elemento.preload = 'auto';
            elemento.addEventListener('canplaythrough', resolve, { once: true });
        } else if (esVideo) {
            elemento = document.createElement('video');
            elemento.preload = 'auto';
            elemento.muted = true;
            elemento.addEventListener('canplaythrough', resolve, { once: true });
        } else {
            elemento = new Image();
            elemento.addEventListener('load', resolve, { once: true });
        }

        elemento.addEventListener('error', resolve, { once: true });
        setTimeout(resolve, TIEMPO_MAXIMO);
        elemento.src = url;
    });
}

export function usePrecarga(urls) {
    const [cargados, setCargados] = useState(0);

    useEffect(() => {
        let activo = true;
        let completados = 0;

        const marcarCompletado = () => {
            if (!activo) return;
            completados += 1;
            setCargados(completados);
        };

        urls.forEach((url) => {
            cargarRecurso(url).then(marcarCompletado);
        });

        return () => {
            activo = false;
        };
    }, [urls]);

    const porcentaje = urls.length === 0 ? 100 : Math.min(100, Math.round((cargados / urls.length) * 100));

    return { porcentaje, completo: porcentaje >= 100 };
}
