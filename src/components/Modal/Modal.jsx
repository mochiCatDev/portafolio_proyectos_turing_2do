import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

function Modal({ libro, chibiUrl, tema, onCerrar }) {
    const [imagenCargada, setImagenCargada] = useState(Boolean(libro.imagen && libro.imagen.trim() !== ''));
    const tituloId = useId();
    const cerrarRef = useRef(null);
    const previoRef = useRef(null);

    const variablesTema = tema ? {
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
    } : undefined;

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
                style={variablesTema}
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

                {/* Chibi en esquina inferior derecha, fuera de la caja del modal */}
                {chibiUrl && (
                    <img
                        className="modal-chibi"
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
