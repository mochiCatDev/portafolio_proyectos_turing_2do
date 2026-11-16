/**
 * Pistas de música de fondo.
 *
 * Solo se incluyen archivos de audio válidos que el navegador pueda decodificar
 * con la etiqueta <audio>: .mp3, .wav, .m4a, .ogg o .aac.
 *
 * Los archivos .mp4 que estaban aquí eran segmentos de video (VP9/AV1) SIN pista
 * de audio, por lo que no se podían reproducir como música y se eliminaron.
 *
 * Para agregar más música:
 * 1. Coloca el archivo de audio en public/sonidos/
 * 2. Agrega una entrada aquí con { id, titulo, url }
 */
export const pistasMusica = [
    {
        id: 1,
        titulo: "Imitadora x Falling in Love",
        url: "/sonidos/imitadora-x-falling-in-love.mp3",
    },
    {
        id: 2,
        titulo: "Valse Sentimentale",
        url: "/sonidos/valse-sentimentale.mp3",
    },
];
