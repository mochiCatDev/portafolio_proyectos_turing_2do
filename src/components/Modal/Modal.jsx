import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

function Modal({ libro, chibiUrl, onCerrar }) {
    const [imagenCargada, setImagenCargada] = useState(Boolean(libro.imagen && libro.imagen.trim() !== ''));
    const esquinaChibi = libro.id % 2 === 0 ? 'derecha' : 'izquierda';
    const tituloId = useId();
    const cerrarRef = useRef(null);
    const previoRef = useRef(null);

    useEffect(() => {
        previoRef.current = document.activeElement;

        const manejarTecla = (e) => {
            if (e.key === 'Escape') {
                onCerrar();
            }
        };

        document.addEventListener('keydown', manejarTecla);

        if (cerrarRef.current) {
            cerrarRef.current.focus();
        }

        return () => {
            document.removeEventListener('keydown', manejarTecla);
            if (previoRef.current && typeof previoRef.current.focus === 'function') {
                previoRef.current.focus();
            }
        };
    }, [onCerrar]);

    return createPortal(
        <div className="modal-fondo" onClick={onCerrar}>
            <aside
                className="modal-panel pegarmina"
                role="dialog"
                aria-modal="true"
                aria-labelledby={tituloId}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="pegarmina-cinta" />

                <button
                    ref={cerrarRef}
                    className="modal-cerrar"
                    onClick={onCerrar}
                    aria-label="Cerrar"
                >
                    ×
                </button>

                {chibiUrl && (
                    <img
                        className={`modal-chibi ${esquinaChibi}`}
                        src={chibiUrl}
                        alt=""
                        loading="lazy"
                        decoding="async"
                    />
                )}

                <div className="modal-contenido">
                    <h2 className="modal-titulo" id={tituloId}>{libro.titulo}</h2>
                    <p className="modal-resumen">{libro.descripcion}</p>

                    <div className="modal-imagen">
                        {!libro.imagen || libro.imagen.trim() === '' ? (
                            <span className="modal-imagen-texto">
                                Imagen no disponible
                            </span>
                        ) : imagenCargada ? (
                            <img
                                src={libro.imagen}
                                alt={`Imagen de ${libro.titulo}`}
                                loading="lazy"
                                decoding="async"
                                onError={() => setImagenCargada(false)}
                            />
                        ) : (
                            <span className="modal-imagen-texto">
                                Imagen no disponible
                            </span>
                        )}
                    </div>

                    {libro.url && libro.url.trim() !== '' && (
                        <a
                            href={libro.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="modal-boton"
                        >
                            Entrar
                        </a>
                    )}
                </div>
            </aside>
        </div>,
        document.body
    );
}

export default Modal;
