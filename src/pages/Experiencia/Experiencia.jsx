import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { proyectos } from '../../data/proyectos';
import './Experiencia.css';

function Experiencia() {
    const [libroAbierto, setLibroAbierto] = useState(false);
    const [paginaActual, setPaginaActual] = useState(0);
    const totalHojas = proyectos.length + 1;

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
                    <motion.div
                        className="libro"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="pagina-base">
                            <p>Fin. ¡Gracias por visitar mi portafolio!</p>
                        </div>

                        {Array.from({ length: totalHojas }, (_, i) => {
                            const pasada = i < paginaActual;
                            const proyecto = proyectos[i - 1];

                            return (
                                <motion.div
                                    key={i}
                                    className="hoja"
                                    style={{ zIndex: pasada ? i : totalHojas - i }}
                                    initial={{ rotateY: 0 }}
                                    animate={{ rotateY: pasada ? -160 : 0 }}
                                    transition={{ duration: 1, ease: 'easeInOut' }}
                                >
                                    <div className="hoja-frente">
                                        {i === 0 ? (
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
                                        ) : (
                                            <div className="proyecto">
                                                <h3>{proyecto.titulo}</h3>
                                                <p>{proyecto.descripcion}</p>
                                                <ul>
                                                    {proyecto.tecnologias.map((t) => (
                                                        <li key={t}>{t}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        <button
                                            className="esquina"
                                            aria-label="Pasar página"
                                            onClick={() => setPaginaActual(i + 1)}
                                        />
                                    </div>
                                    <div className="hoja-reverso"></div>
                                </motion.div>
                            );
                        })}

                        <motion.div
                            className="tapa"
                            style={{ zIndex: 100 }}
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
                )}
            </AnimatePresence>
        </main>
    );
}

export default Experiencia;
