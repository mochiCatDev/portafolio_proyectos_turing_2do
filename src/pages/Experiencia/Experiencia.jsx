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
                            className="libro"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 40 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="pagina-base">
                                <motion.div
                                    className="intro"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 2 }}
                                >
                                    <p className="intro-saludo">Bienvenido a mi portafolio</p>
                                    <h2>Dilan Solorzano</h2>
                                    <p className="intro-texto">
                                        Desarrollador frontend. Aquí encontrarás los proyectos
                                        en los que he trabajado.
                                    </p>
                                    <p className="intro-pista">Toca la esquina →</p>
                                </motion.div>
                            </div>
                        
                            <motion.div
                                className="tapa"
                                initial={{ rotateY: 0 }}
                                animate={{ rotateY: -160 }}
                                transition={{ duration: 1.4, delay: 1, ease: 'easeInOut' }}
                            >
                                <div className="tapa-exterior">
                                    <span>Mis Proyectos</span>
                                </div>
                                <div className="tapa-interior"></div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </main>
    );
}

export default Experiencia;
