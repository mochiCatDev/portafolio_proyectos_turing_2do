import { useState } from 'react';
import Libro3D from '../../components/Libro3D/Libro3D';
import './Experiencia.css';

function Experiencia() {
    const [libroAbierto, setLibroAbierto] = useState(false);

    return (
        <main className="escena-oscura">
            <div className="escena">
                <video
                    className="video-fondo"
                    src="/videos/fondo.mp4"
                    autoPlay
                    muted
                    playsInline
                    disablePictureInPicture
                />
                <div className="video-fundido"></div>

                <button
                    className="hotspot-libro"
                    aria-label="Abrir libro de proyectos"
                    onClick={() => setLibroAbierto(true)}
                />
            </div>

            {libroAbierto && <Libro3D onCerrar={() => setLibroAbierto(false)} />}
        </main>
    );
}

export default Experiencia;
