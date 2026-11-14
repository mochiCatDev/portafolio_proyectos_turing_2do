import { useRef, useState } from 'react';
import Libro3D from '../../components/Libro3D/Libro3D';
import './Experiencia.css';

const SEGUNDO_APERTURA = 9;

function Experiencia() {
    const [libroAbierto, setLibroAbierto] = useState(false);
    const [permitido, setPermitido] = useState(false);
    const videoRef = useRef(null);

    const manejarTiempo = () => {
        if (videoRef.current && videoRef.current.currentTime >= SEGUNDO_APERTURA) {
            setPermitido(true);
        }
    };

    return (
        <main className="escena-oscura">
            <div className="escena">
                <video
                    ref={videoRef}
                    className="video-fondo"
                    src="/videos/fondo.mp4"
                    autoPlay
                    muted
                    playsInline
                    disablePictureInPicture
                    onTimeUpdate={manejarTiempo}
                    onEnded={() => setPermitido(true)}
                />
                <div className="video-fundido"></div>

                <button
                    className="hotspot-libro"
                    aria-label="Abrir libro de proyectos"
                    disabled={!permitido}
                    onClick={() => setLibroAbierto(true)}
                />
            </div>

            {libroAbierto && <Libro3D onCerrar={() => setLibroAbierto(false)} />}
        </main>
    );
}

export default Experiencia;
