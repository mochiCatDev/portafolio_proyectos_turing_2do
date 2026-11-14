import './Experiencia.css';

function Experiencia() {
    const manejarClickLibro = () => console.log('Libro pulsado');

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
                    onClick={manejarClickLibro}
                />
            </div>
        </main>
    );
}

export default Experiencia;
