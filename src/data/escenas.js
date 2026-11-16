/**
 * Escenas sincronizadas: cada escena define su audio y su fondo.
 *
 * Para agregar más escenas, solo agrega un objeto al array con el siguiente id.
 * Los archivos de audio van en public/audios/ (audio1.mp3, audio2.mp3, ...).
 * Los archivos de fondo van en public/fondos/ (fondo.mp4, fondo1.mp4, ...).
 *
 * Si hay más audios o fondos de los que se emparejan en este array,
 * simplemente no aparecen en la página y no se borran de la carpeta.
 */
export const escenas = [
    {
        id: 1,
        titulo: "Intro",
        audio: "/audios/audio1.mp3",
        fondo: "/fondos/fondo.mp4",
        tipoFondo: "video",
        esIntro: true,
    },
    {
        id: 2,
        titulo: "Escena 2",
        audio: "/audios/audio2.mp3",
        fondo: "/fondos/fondo1.mp4",
        tipoFondo: "video",
        esIntro: false,
    },
];
