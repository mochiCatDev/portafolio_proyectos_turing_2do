export const chibis = [
    { id: 1, url: '/imagenes/chibi/1.png' },
    { id: 2, url: '/imagenes/chibi/2.png' },
    { id: 3, url: '/imagenes/chibi/3.png' },
    { id: 4, url: '/imagenes/chibi/4.png' },
    { id: 5, url: '/imagenes/chibi/5.png' },
    { id: 5, url: '/imagenes/chibi/6.png' },
    { id: 5, url: '/imagenes/chibi/7.png' },
    { id: 5, url: '/imagenes/chibi/8.png' },
];

export function obtenerChibiParaProyecto(idProyecto, listaProyectos) {
    const indice = listaProyectos.findIndex((p) => p.id === idProyecto);
    if (indice === -1) return chibis[0];
    return chibis[indice % chibis.length];
}
