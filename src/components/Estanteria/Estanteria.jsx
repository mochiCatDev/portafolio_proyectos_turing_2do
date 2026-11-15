import { Fragment, useMemo, useState } from 'react';
import { proyectos } from '../../data/proyectos';
import Modal from '../../components/Modal/Modal';
import './Estanteria.css';

function mezclar(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function calcularGrosor(id) {
    return 36 + Math.floor((Math.sin(id * 2.3) + 1) / 2 * 22);
}

function calcularAltura(id) {
    return 160 + Math.floor((Math.cos(id * 1.7) + 1) / 2 * 35);
}

function calcularInclinacion(id) {
    return Math.floor((Math.sin(id) + 1) / 2 * 8) - 4;
}

function Libro({ proyecto, onClick }) {
    const grosor = calcularGrosor(proyecto.id);
    const altura = calcularAltura(proyecto.id);
    const tono = [
        '#5d4037', '#4e342e', '#3e2723', '#6d4c41',
        '#37474f', '#263238', '#1a237e', '#4a148c',
        '#b71c1c', '#33691e', '#795548', '#424242'
    ][proyecto.id % 12];
    const inclinacion = calcularInclinacion(proyecto.id);

    return (
        <button
            type="button"
            className="libro"
            aria-label={`Abrir proyecto ${proyecto.titulo}`}
            style={{
                width: `${grosor}px`,
                height: `${altura}px`,
                '--tono': tono,
                '--inclinacion': `${inclinacion}deg`
            }}
            onClick={() => onClick(proyecto)}
        >
            <span className="libro-canto-superior" />
            <span className="libro-lomo">
                <span className="libro-cinta" />
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

function Estanteria() {
    const [libroSeleccionado, setLibroSeleccionado] = useState(null);
    const librosMezclados = useMemo(() => mezclar(proyectos), []);
    const estantes = repartirEnEstantes(librosMezclados);

    const manejarSeleccion = (proyecto) => setLibroSeleccionado(proyecto);

    return (
        <aside className="estanteria">
            <div className="estanteria-marco">
                <div className="moldura-superior" />
                <div className="estanteria-interior">
                    {estantes.map((libros, i) => (
                        <Estante key={i} libros={libros} onSeleccion={manejarSeleccion} />
                    ))}
                </div>
                <div className="moldura-inferior" />
                <div className="sombra-derecha" />
            </div>

            {libroSeleccionado && (
                <Modal libro={libroSeleccionado} onCerrar={() => setLibroSeleccionado(null)} />
            )}
        </aside>
    );
}

export default Estanteria;
