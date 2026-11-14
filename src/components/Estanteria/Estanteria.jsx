import { useState } from 'react';
import { proyectos } from '../../data/proyectos';
import Modal from '../../components/Modal/Modal';
import './Estanteria.css';

function Libro({ proyecto, onClick }) {
    const grosor = 38 + Math.floor(Math.sin(proyecto.id * 2.3) * 14);
    const altura = 150 + Math.floor(Math.cos(proyecto.id * 1.7) * 40);
    const tono = [
        '#5d4037', '#4e342e', '#3e2723', '#6d4c41',
        '#37474f', '#263238', '#1a237e', '#4a148c',
        '#b71c1c', '#33691e'
    ][proyecto.id % 10];

    return (
        <div
            className="libro"
            style={{
                width: `${grosor}px`,
                height: `${altura}px`,
                '--tono': tono
            }}
            onClick={onClick}
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

function Estanteria() {
    const [libroSeleccionado, setLibroSeleccionado] = useState(null);

    const mitad = Math.ceil(proyectos.length / 2);

    return (
        <aside className="estanteria">
            <div className="estanteria-marco">
                <div className="moldura-superior" />
                <div className="estanteria-interior">
                    <div className="estante">
                        {proyectos.slice(0, mitad).map((p) => (
                            <Libro
                                key={p.id}
                                proyecto={p}
                                onClick={() => setLibroSeleccionado(p)}
                            />
                        ))}
                    </div>
                    <div className="estante">
                        {proyectos.slice(mitad).map((p) => (
                            <Libro
                                key={p.id}
                                proyecto={p}
                                onClick={() => setLibroSeleccionado(p)}
                            />
                        ))}
                    </div>
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
