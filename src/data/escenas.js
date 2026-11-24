/**
 * Escenas sincronizadas: cada escena define su audio y su fondo.
 *
 * Para agregar más escenas, solo agrega un objeto al array con el siguiente id.
 * Los archivos de audio van en public/audios/ (audio1.mp3, audio2.mp3, ...).
 * Los archivos de fondo van en public/fondos/ (fondo1.mp4, fondo2.mp4, ...).
 *
 * Si hay más audios o fondos de los que se emparejan en este array,
 * simplemente no aparecen en la página y no se borran de la carpeta.
 */

export const escenas = [
  {
    id: 1,
    titulo: "Intro",
    temaId: 1,
    // El fondo.mp4 trae su propia música; no usa audio separado
    audio: null,
    fondo: "/fondos/fondo1.mp4",
    tipoFondo: "video",
    esIntro: true,
  },
  {
    id: 2,
    titulo: "Escena 2",
    temaId: 2,
    audio: "/audios/audio2.mp3",
    fondo: "/fondos/fondo2.mp4",
    tipoFondo: "video",
    esIntro: false,
  },
  {
    id: 3,
    titulo: "Escena 3",
    temaId: 3,
    audio: "/audios/audio3.mp3",
    fondo: "/fondos/fondo3.mp4",
    tipoFondo: "video",
    esIntro: false,
  },
  {
    id: 4,
    titulo: "Escena 4",
    temaId: 4,
    audio: "/audios/audio4.mp3",
    fondo: "/fondos/fondo4.mp4",
    tipoFondo: "video",
    esIntro: false,
  },
  {
    id: 5,
    titulo: "Escena 5",
    temaId: 5,
    audio: "/audios/audio5.mp3",
    fondo: "/fondos/fondo5.mp4",
    tipoFondo: "video",
    esIntro: false,
  },
];
