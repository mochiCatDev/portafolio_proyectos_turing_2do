import { useEffect, useState } from 'react';
import './AvisoMovil.css';

/**
 * Detecta si la visita es desde un dispositivo móvil.
 * Si lo es, muestra un aviso pidiendo usar una computadora y oculta el contenido.
 */
export default function AvisoMovil({ children }) {
    const [esMovil, setEsMovil] = useState(false);

    useEffect(() => {
        const detectar = () => {
            const esPantallaPequena = window.matchMedia('(max-width: 768px)').matches;
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const esDispositivoMovil =
                /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
                    userAgent
                );
            setEsMovil(esPantallaPequena || esDispositivoMovil);
        };

        detectar();
        const mq = window.matchMedia('(max-width: 768px)');
        mq.addEventListener('change', detectar);
        return () => mq.removeEventListener('change', detectar);
    }, []);

    if (esMovil) {
        return (
            <div className="aviso-movil">
                <div className="aviso-contenido">
                    <div className="aviso-icono">💻</div>
                    <h2 className="aviso-titulo">
                        Esta página se ve mejor desde una computadora
                    </h2>
                    <p className="aviso-texto">
                        El contenido está diseñado para pantallas de escritorio. Por favor, abre esta
                        página desde una computadora para disfrutar la experiencia completa.
                    </p>
                    <button className="aviso-boton" onClick={() => window.location.reload()}>
                        Recargar página
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
