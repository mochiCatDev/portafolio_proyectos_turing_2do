import { useState } from 'react';
import { proyectos } from '../../data/proyectos';
import Modal from '../../components/Modal/Modal';
import './Estanteria.css';

function Estanteria() {
    const [libroSeleccionado, setLibroSeleccionado] = useState(null);

    return (
        <aside className="estanteria">
            <div className="estanteria-marco">
                <div className="estanteria-estantes">
                    {proyectos.map((proyecto) => (
                        <div
                            key={proyecto.id}
                            className="libro"
                            onClick={() => setLibroSeleccionado(proyecto)}
                        >
                            <div className="libro-lomo">
                                <div className="libro-titulo">{proyecto.titulo}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {libroSeleccionado && (
                <Modal libro={libroSeleccionado} onCerrar={() => setLibroSeleccionado(null)} />
            )}
        </aside>
    );
}

export default Estanteria;
