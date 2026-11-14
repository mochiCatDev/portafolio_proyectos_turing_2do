import { useState, useEffect } from 'react';

function MaquinaDeEscribir({ 
    mensajes = [],      // Recibe cualquier arreglo de textos
    velocidad = 50,     // Velocidad entre letras (ms)
    tiempoPausa = 2000, // Pausa entre mensajes (ms)
    bucle = false       // Si es true, vuelve a empezar al terminar
}) {
    const [indiceMensaje, setIndiceMensaje] = useState(0);
    const [textoMostrado, setTextoMostrado] = useState('');
    const [indiceLetra, setIndiceLetra] = useState(0);

    useEffect(() => {
        setIndiceMensaje(0);
        setTextoMostrado('');
        setIndiceLetra(0);
    }, [mensajes]);

    const mensajeActual = mensajes[indiceMensaje] || '';

    useEffect(() => {
        if (mensajes.length === 0) return;

        if (indiceLetra < mensajeActual.length) {
            const timer = setTimeout(() => {
                setTextoMostrado((prev) => prev + mensajeActual.charAt(indiceLetra));
                setIndiceLetra((prev) => prev + 1);
            }, velocidad);

            return () => clearTimeout(timer);
        } else {
            const pausa = setTimeout(() => {
                if (indiceMensaje < mensajes.length - 1) {
                    setIndiceMensaje((prev) => prev + 1);
                    setTextoMostrado('');
                    setIndiceLetra(0);
                } else if (bucle) {
                    setIndiceMensaje(0);
                    setTextoMostrado('');
                    setIndiceLetra(0);
                }
            }, tiempoPausa);

            return () => clearTimeout(pausa);
        }
    }, [indiceLetra, mensajeActual, indiceMensaje, mensajes, velocidad, tiempoPausa, bucle]);

    return (
        <p className="maquina-escribir">
            {textoMostrado}
            <span className="cursor">|</span>
        </p>
    );
}

export default MaquinaDeEscribir;