import { useEffect, useState } from 'react';

const TIEMPO_MAXIMO = 15000; // ms antes de dar el recurso por terminado

function cargarRecurso(url) {
    return new Promise((resolve) => {
        const esVideo = /\.(mp4|webm)$/i.test(url);
        const elemento = esVideo ? document.createElement('video') : new Image();

        if (esVideo) {
            elemento.preload = 'auto';
            elemento.muted = true;
            elemento.addEventListener('canplaythrough', resolve, { once: true });
        } else {
            elemento.addEventListener('load', resolve, { once: true });
        }

        elemento.addEventListener('error', resolve, { once: true });
        setTimeout(resolve, TIEMPO_MAXIMO);
        elemento.src = url;
    });
}

export function usePrecarga(urls) {
    const [estado, setEstado] = useState({ urls: [], contador: 0 });

    useEffect(() => {
        let activo = true;
        let contador = 0;

        urls.forEach((url) => {
            cargarRecurso(url).then(() => {
                contador += 1;
                if (activo) setEstado({ urls, contador });
            });
        });

        return () => {
            activo = false;
        };
    }, [urls]);

    const cargados = estado.urls === urls ? estado.contador : 0;

    const porcentaje = urls.length === 0
        ? 100
        : Math.min(100, Math.round((cargados / urls.length) * 100));

    return { porcentaje, completo: porcentaje >= 100 };
}
