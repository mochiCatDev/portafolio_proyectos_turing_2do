import { useState } from 'react';
import './Modal.css';

function Modal({ libro, onCerrar }) {
    const [imagenCargada, setImagenCargada] = useState(true);

    return (
        <div className="modal-fondo" onClick={onCerrar}>
            <aside className="modal-panel" onClick={(e) => e.stopPropagation()}>
                <button className="modal-cerrar" onClick={onCerrar} aria-label="Cerrar">
                    ×
                </button>

                <div className="modal-contenido">
                    <h2 className="modal-titulo">{libro.titulo}</h2>
                    <p className="modal-resumen">{libro.descripcion}</p>

                    <div className="modal-imagen">
                        {imagenCargada ? (
                            <img
                                src={libro.imagen}
                                alt={`Imagen de ${libro.titulo}`}
                                loading="lazy"
                                onError={() => setImagenCargada(false)}
                            />
                        ) : (
                            <span className="modal-imagen-texto">
                                Imagen no disponible
                            </span>
                        )}
                    </div>

                    <a
                        href={libro.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modal-boton"
                    >
                        Entrar
                    </a>
                </div>
            </aside>
        </div>
    );
}

export default Modal;
