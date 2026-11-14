import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import './Libro3D.css';

const ANCHO = 1.5;
const ALTO = 2;
const GROSOR_TAPA = 0.04;
const GROSOR_PAGINAS = 0.2;
const COLOR_TAPA = '#5b2a1a';
const COLOR_PAGINAS = '#f1e3c2';
const ANGULO_ABIERTO = -2.8;

function Libro() {
    const mitad = GROSOR_PAGINAS / 2 + GROSOR_TAPA / 2;
    const tapaRef = useRef();
    const [abierta, setAbierta] = useState(false);

    useEffect(() => {
        const temporizador = setTimeout(() => setAbierta(true), 1000);
        return () => clearTimeout(temporizador);
    }, []);

    useFrame((_, delta) => {
        const objetivo = abierta ? ANGULO_ABIERTO : 0;
        tapaRef.current.rotation.y = MathUtils.damp(
            tapaRef.current.rotation.y,
            objetivo,
            3,
            delta
        );
    });

    return (
        <group position={[-2, 0, 0]} rotation={[0.15, 0.4, 0]}>
            {/* Tapa trasera */}
            <mesh position={[ANCHO / 2, 0, -mitad]}>
                <boxGeometry args={[ANCHO, ALTO, GROSOR_TAPA]} />
                <meshStandardMaterial color={COLOR_TAPA} />
            </mesh>

            {/* Bloque de páginas */}
            <mesh position={[ANCHO / 2, 0, 0]}>
                <boxGeometry args={[ANCHO - 0.1, ALTO - 0.1, GROSOR_PAGINAS]} />
                <meshStandardMaterial color={COLOR_PAGINAS} />
            </mesh>

            {/* Lomo */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[GROSOR_TAPA, ALTO, GROSOR_PAGINAS + GROSOR_TAPA * 2]} />
                <meshStandardMaterial color={COLOR_TAPA} />
            </mesh>

            {/* Tapa delantera: el grupo es el pivote en el lomo */}
            <group ref={tapaRef} position={[0, 0, mitad]}>
                <mesh position={[ANCHO / 2, 0, 0]}>
                    <boxGeometry args={[ANCHO, ALTO, GROSOR_TAPA]} />
                    <meshStandardMaterial color={COLOR_TAPA} />
                </mesh>
            </group>
        </group>
    );
}

function Libro3D() {
    return (
        <Canvas className="libro-canvas" camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={1.2} />
            <directionalLight position={[3, 3, 5]} intensity={2} />
            <Libro />
        </Canvas>
    );
}

export default Libro3D;
