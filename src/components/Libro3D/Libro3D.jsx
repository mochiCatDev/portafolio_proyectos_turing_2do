import { Canvas } from '@react-three/fiber';
import './Libro3D.css';

function Libro3D() {
    return (
        <Canvas className="libro-canvas" camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={1.2} />
            <directionalLight position={[3, 3, 5]} intensity={2} />

            <mesh rotation={[0.4, 0.6, 0]}>
                <boxGeometry args={[1.5, 2, 0.3]} />
                <meshStandardMaterial color="#5b2a1a" />
            </mesh>
        </Canvas>
    );
}

export default Libro3D;
