import { escenas } from '../data/escenas';
import { getTema } from '../data/temas';

/**
 * Hook que devuelve el tema activo segķn el índice de escena.
 * Los colores se derivan directamente del fondo/scena activa.
 * No hay "modo claro" ni "modo oscuro" tradicionales.
 */
export function useEstetica(indiceEscena) {
    const escena = escenas.find((e) => e.id === indiceEscena);
    const temaId = escena?.temaId ?? 1;
    const tema = getTema(temaId);

    return {
        tema,
        escena,
    };
}
