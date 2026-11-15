import { Link } from 'react-router-dom';
import './NoEncontrado.css';

function NoEncontrado() {
    return (
        <div className="no-encontrado">
            <div className="no-encontrado-contenido">
                <h1 className="no-encontrado-codigo">404</h1>
                <p className="no-encontrado-mensaje">Esta página no existe</p>
                <Link to="/" className="no-encontrado-boton">
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}

export default NoEncontrado;
