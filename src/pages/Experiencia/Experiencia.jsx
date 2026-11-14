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
        	    disablePictureInPicture
        	/>
            <div className="video-fundido"></div>
        </main>
    );
}

export default Experiencia;
