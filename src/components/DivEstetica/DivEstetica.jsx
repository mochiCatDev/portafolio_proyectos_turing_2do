import { Fragment, useMemo, useState } from 'react';
import { proyectos } from '../../data/proyectos';
import { chibis } from '../../data/chibis';
import { useEstetica } from '../../hooks/useEstetica';
import Modal from '../Modal/Modal';
import './DivEstetica.css';

function mezclar(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function calcularGrosor(id) {
    return 34 + Math.floor((Math.sin(id * 2.3) + 1) / 2 * 20);
}

function calcularAltura(id) {
    return 150 + Math.floor((Math.cos(id * 1.7) + 1) / 2 * 30);
}

function calcularInclinacion(id) {
    return Math.floor((Math.sin(id) + 1) / 2 * 6) - 3;
}

function Libro({ proyecto, onClick }) {
    const grosor = calcularGrosor(proyecto.id);
    const altura = calcularAltura(proyecto.id);
    const inclinacion = calcularInclinacion(proyecto.id);

    return (
        <button
            type="button"
            className="libro"
            aria-label={`Abrir proyecto ${proyecto.titulo}`}
            style={{
                width: `${grosor}px`,
                height: `${altura}px`,
                '--inclinacion': `${inclinacion}deg`,
            }}
            onClick={() => onClick(proyecto)}
        >
            <span className="libro-canto-superior" />
            <span className="libro-lomo">
                <span className="libro-titulo">{proyecto.titulo}</span>
            </span>
            <span className="libro-canto-inferior" />
            <span className="libro-brillo" />
        </button>
    );
}

function Estante({ libros, onSeleccion }) {
    return (
        <div className="estante">
            {libros.map((proyecto) => (
                <Fragment key={proyecto.id}>
                    <Libro
                        proyecto={proyecto}
                        onClick={() => onSeleccion(proyecto)}
                    />
                </Fragment>
            ))}
        </div>
    );
}

const LIBROS_POR_ESTANTE = 4;

function repartirEnEstantes(libros) {
    const total = libros.length;
    const cantidadEstantes = Math.max(2, Math.ceil(total / LIBROS_POR_ESTANTE));
    const estantes = [];
    const base = Math.floor(total / cantidadEstantes);
    const sobrante = total % cantidadEstantes;
    let indice = 0;
    for (let i = 0; i < cantidadEstantes; i++) {
        const tamaño = base + (i < sobrante ? 1 : 0);
        estantes.push(libros.slice(indice, indice + tamaño));
        indice += tamaño;
    }
    return estantes;
}

export default function DivEstetica({ indiceEscena }) {
    const [libroSeleccionado, setLibroSeleccionado] = useState(null);
    const librosMezclados = useMemo(() => mezclar(proyectos), []);
    const estantes = repartirEnEstantes(librosMezclados);
    const { tema } = useEstetica(indiceEscena);

    const variablesTema = {
        '--color-fondo': tema.fondo,
        '--color-superficie': tema.superficie,
        '--color-superficie-secundaria': tema.superficieSecundaria,
        '--color-texto': tema.texto,
        '--color-texto-secundario': tema.textoSecundario,
        '--color-acento': tema.acento,
        '--color-acento-secundario': tema.acentoSecundario,
        '--color-borde': tema.borde,
        '--color-borde-secundario': tema.bordeSecundario,
        '--color-sombra': tema.sombra,
        '--color-sombra-interna': tema.sombraInterna,
        '--color-gradiente': tema.gradiente,
        '--color-libro-brillo': tema.libroBrillo,
    };

    const manejarSeleccion = (proyecto) => setLibroSeleccionado(proyecto);

    return (
        <div className="div-estetica" style={variablesTema}>
            {/* Chibi en esquina inferior derecha, fuera de la caja, position absolute */}
            {chibis[0] && (
                <img
                    className="div-chibi"
                    src={chibis[0].url}
                    alt=""
                    loading="lazy"
                    decoding="async"
                />
            )}

            <div className="div-panel">
                <div className="div-header">
                    <h2 className="div-titulo">Mis Proyectos Web</h2>
                </div>

                <div className="div-scroll">
                    {estantes.map((libros, i) => (
                        <Estante
                            key={i}
                            libros={libros}
                            onSeleccion={manejarSeleccion}
                        />
                    ))}
                </div>
            </div>

            {libroSeleccionado && (
                <Modal
                    libro={libroSeleccionado}
                    chibiUrl={chibis[proyectos.findIndex((p) => p.id === libroSeleccionado.id) % chibis.length].url}
                    tema={tema}
                    onCerrar={() => setLibroSeleccionado(null)}
                />
            )}
        </div>
    );
}
