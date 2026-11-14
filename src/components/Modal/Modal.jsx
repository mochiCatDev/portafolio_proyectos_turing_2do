import './Modal.css';

function Modal({ libro, onCerrar }) {
    return (
        <div className="modal-fondo" onClick={onCerrar}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-cerrar" onClick={onCerrar} aria-label="Cerrar">
                    ×
                </button>
                <div className="modal-cuerpo">
                    <h2 className="modal-titulo">{libro.titulo}</h2>
                    <p className="modal-descripcion">{libro.descripcion}</p>
                    <p className="modal-tecnologias">{libro.tecnologias.join(' · ')}</p>
                </div>
            </div>
        </div>
    );
}

export default Modal;
