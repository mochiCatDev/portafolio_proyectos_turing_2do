import './Experiencia.css';

function Experiencia() {
    return (
        <main className="escena-oscura">
        	<video
                className="video-fondo"
                src="/videos/fondo.mp4"
                autoPlay
                muted
                loop
                playsInline
            />
            <div className="video-fundido"></div>
            <div className="luz-trasera"></div>

            <img
                src="/imagenes/dilan-quieto.png"
                alt="Dilan"
                className="personaje-dilan"
            />
        </main>
    );
}

export default Experiencia;
