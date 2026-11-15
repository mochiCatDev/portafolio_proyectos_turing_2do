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

function Libro({ proyecto, onClick }) {
    const grosor = 40 + Math.floor(Math.sin(proyecto.id * 2.3) * 18);
    const altura = 140 + Math.floor(Math.cos(proyecto.id * 1.7) * 50);
    const tono = [
        '#5d4037', '#4e342e', '#3e2723', '#6d4c41',
        '#37474f', '#263238', '#1a237e', '#4a148c',
        '#b71c1c', '#33691e', '#795548', '#424242'
    ][proyecto.id % 12];
    const inclinacion = -3 + Math.floor(Math.sin(proyecto.id) * 6);

    return (
        <div
            className="libro"
            style={{
                width: `${grosor}px`,
                height: `${altura}px`,
                '--tono': tono,
                '--inclinacion': `${inclinacion}deg`
            }}
            onClick={() => onClick(proyecto)}
        >
            <div className="libro-canto-superior" />
            <div className="libro-lomo">
                <div className="libro-cinta" />
                <div className="libro-titulo">{proyecto.titulo}</div>
            </div>
            <div className="libro-canto-inferior" />
            <div className="libro-brillo" />
        </div>
    );
}

function EspacioVacio({ ancho }) {
    return <div className="espacio-vacio" style={{ width: `${ancho}px` }} />;
}

function Estante({ libros, indice, onSeleccion }) {
    const anchoDisponible = 300;
    const grosores = libros.map(
        (p) => 40 + Math.floor(Math.sin(p.id * 2.3) * 18)
    );
    const totalLibros = grosores.reduce((a, b) => a + b, 0);
    const cantidadEspacios = libros.length + 1;
    const espacioBase = Math.max(
        (anchoDisponible - totalLibros - (cantidadEspacios - 1) * 12) / cantidadEspacios,
        10
    );

    return (
        <div className="estante" style={{ '--indice': indice }}>
            <EspacioVacio ancho={espacioBase} />
            {libros.map((proyecto, i) => (
                <Fragment key={proyecto.id}>
                    <Libro
                        proyecto={proyecto}
                        onClick={() => onSeleccion(proyecto)}
                    />
                    {i < libros.length - 1 && <EspacioVacio ancho={espacioBase} />}
                </Fragment>
            ))}
            <EspacioVacio ancho={espacioBase} />
        </div>
    );
}

function Estanteria() {
    const [libroSeleccionado, setLibroSeleccionado] = useState(null);
    const librosMezclados = useMemo(() => mezclar(proyectos), []);
    const mitad = Math.ceil(librosMezclados.length / 2);

    const manejarSeleccion = (proyecto) => setLibroSeleccionado(proyecto);

    return (
        <aside className="estanteria">
            <div className="estanteria-marco">
                <div className="moldura-superior" />
                <div className="estanteria-interior">
                    <Estante
                        libros={librosMezclados.slice(0, mitad)}
                        indice={0}
                        onSeleccion={manejarSeleccion}
                    />
                    <Estante
                        libros={librosMezclados.slice(mitad)}
                        indice={1}
                        onSeleccion={manejarSeleccion}
                    />
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
