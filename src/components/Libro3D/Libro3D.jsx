import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import { proyectos } from '../../data/proyectos';
import './Libro3D.css';

const ANCHO = 1.5;
const ALTO = 2;
const GROSOR_TAPA = 0.04;
const ESPACIO = 0.03;
const TOTAL_HOJAS = proyectos.length + 1; // intro + proyectos
const GROSOR_PAGINAS = (TOTAL_HOJAS + 1) * ESPACIO; // + contraportada
const COLOR_TAPA = '#5b2a1a';
const COLORES_HOJA = ['#f1e3c2', '#e9d8b0'];
const ANGULO_ABIERTO = -2.8;
const ANGULO_HOJA = -2.8;

function Hoja({ indice, pasada, activa, onPasar }) {
    const grupoRef = useRef();
    // La hoja 0 es la más cercana a la tapa delantera
    const z = GROSOR_PAGINAS / 2 - ESPACIO / 2 - indice * ESPACIO;

    useFrame((_, delta) => {
        const objetivo = pasada ? ANGULO_HOJA : 0;
        grupoRef.current.rotation.y = MathUtils.damp(
            grupoRef.current.rotation.y,
            objetivo,
            4,
            delta
        );
    });

    const manejarClick = (e) => {
        if (!activa) return;
        e.stopPropagation();
        document.body.style.cursor = 'auto';
        onPasar();
    };

    return (
        <group ref={grupoRef} position={[0, 0, z]}>
            <mesh
                position={[ANCHO / 2, 0, 0]}
                onClick={manejarClick}
                onPointerOver={() => {
                    if (activa) document.body.style.cursor = 'pointer';
                }}
                onPointerOut={() => {
                    document.body.style.cursor = 'auto';
                }}
            >
                <boxGeometry args={[ANCHO - 0.1, ALTO - 0.1, ESPACIO * 0.9]} />
                <meshStandardMaterial color={COLORES_HOJA[indice % 2]} />
            </mesh>
        </group>
    );
}

function Libro() {
    const mitad = GROSOR_PAGINAS / 2 + GROSOR_TAPA / 2;
    const tapaRef = useRef();
    const [abierta, setAbierta] = useState(false);
    const [paginaActual, setPaginaActual] = useState(0);

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

            {/* Contraportada: la última página, fija */}
            <mesh position={[ANCHO / 2, 0, -GROSOR_PAGINAS / 2 + ESPACIO / 2]}>
                <boxGeometry args={[ANCHO - 0.1, ALTO - 0.1, ESPACIO * 0.9]} />
                <meshStandardMaterial color={COLORES_HOJA[TOTAL_HOJAS % 2]} />
            </mesh>

            {/* Hojas: intro + una por proyecto */}
            {Array.from({ length: TOTAL_HOJAS }, (_, i) => (
                <Hoja
                    key={i}
                    indice={i}
                    pasada={i < paginaActual}
                    activa={abierta && i === paginaActual}
                    onPasar={() => setPaginaActual(i + 1)}
                />
            ))}

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
