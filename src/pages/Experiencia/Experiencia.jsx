import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
                    loop
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

            <AnimatePresence>
                {libroAbierto && (
                    <>
                        <motion.div
                            className="fondo-libro"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                        <motion.div
                            className="libro"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 40 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span>Mis Proyectos</span>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </main>
    );
}

export default Experiencia;
