/**
 * Temas de colores por escena.
 *
 * Cada escena de src/data/escenas.js puede tener un temaId que apunte aquí.
 * Los colores se definen en una sola fuente de datos para que puedas (o otra IA)
 * modificarlos fácilmente según el fondo de cada escena.
 *
 * No hay "modo claro" ni "modo oscuro" tradicionales: la estética se deriva
 * directamente del fondo activo.
 */
export const temas = {
    1: {
        nombre: "neon-azul",
        fondo: "#0a0a0f",
        superficie: "#161b22",
        superficieSecundaria: "#21262d",
        texto: "#f0f6fc",
        textoSecundario: "#8b949e",
        acento: "#58a6ff",
        acentoSecundario: "#1f6feb",
        borde: "rgba(88, 166, 255, 0.4)",
        bordeSecundario: "rgba(31, 111, 235, 0.2)",
        sombra: "0 24px 48px rgba(0, 0, 0, 0.7)",
        sombraInterna: "inset 0 1px 0 rgba(88, 166, 255, 0.15)",
        gradiente: "linear-gradient(180deg, #161b22 0%, #0d1117 100%)",
        libroBrillo: "rgba(88, 166, 255, 0.3)",
    },
    2: {
        nombre: "neon-esmeralda",
        fondo: "#061413",
        superficie: "#111c18",
        superficieSecundaria: "#162320",
        texto: "#e6fff4",
        textoSecundario: "#6ee7b7",
        acento: "#34d399",
        acentoSecundario: "#10b981",
        borde: "rgba(52, 211, 153, 0.4)",
        bordeSecundario: "rgba(16, 185, 129, 0.2)",
        sombra: "0 24px 48px rgba(0, 0, 0, 0.7)",
        sombraInterna: "inset 0 1px 0 rgba(52, 211, 153, 0.15)",
        gradiente: "linear-gradient(180deg, #111c18 0%, #0b1713 100%)",
        libroBrillo: "rgba(52, 211, 153, 0.3)",
    },
    3: {
        nombre: "neon-purpura",
        fondo: "#110819",
        superficie: "#1c1124",
        superficieSecundaria: "#261832",
        texto: "#f3e8ff",
        textoSecundario: "#c4b5fd",
        acento: "#a855f7",
        acentoSecundario: "#7e22ce",
        borde: "rgba(168, 85, 247, 0.4)",
        bordeSecundario: "rgba(126, 34, 206, 0.2)",
        sombra: "0 24px 48px rgba(0, 0, 0, 0.7)",
        sombraInterna: "inset 0 1px 0 rgba(168, 85, 247, 0.15)",
        gradiente: "linear-gradient(180deg, #1c1124 0%, #140a1b 100%)",
        libroBrillo: "rgba(168, 85, 247, 0.3)",
    },
    4: {
        nombre: "neon-rojo",
        fondo: "#1a0606",
        superficie: "#241111",
        superficieSecundaria: "#2d1414",
        texto: "#ffe6e6",
        textoSecundario: "#fca5a5",
        acento: "#f87171",
        acentoSecundario: "#ef4444",
        borde: "rgba(248, 113, 113, 0.4)",
        bordeSecundario: "rgba(239, 68, 68, 0.2)",
        sombra: "0 24px 48px rgba(0, 0, 0, 0.7)",
        sombraInterna: "inset 0 1px 0 rgba(248, 113, 113, 0.15)",
        gradiente: "linear-gradient(180deg, #241111 0%, #160808 100%)",
        libroBrillo: "rgba(248, 113, 113, 0.3)",
    },
};

export function getTema(temaId) {
    return temas[temaId] || temas[1];
}
