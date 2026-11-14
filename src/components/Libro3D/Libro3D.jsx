import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { motion } from 'framer-motion';
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
const TIEMPO_CIERRE = 1800; // ms que dura la animación de cierre
const FUENTE = '/fonts/Lora-Regular.ttf';
const OBJETIVO_ALTO = 0.68; // fracción del alto visible que ocupa el libro cerrado
const MARGEN = 0.05; // margen de seguridad al abrir el libro
const ESCALA_MAX = 2; // límite superior de escala en pantallas muy grandes
const SEGMENTOS_HOJA = 20;
const RIGIDEZ = 50;
const AMORTIGUACION = 12;
const CURVATURA = 0.35;
const ELEVACION = 0.12;
const VELOCIDAD_DOBLEZ = 6;
const SIGNO_CURVA = 1; // la hoja gira hacia ángulos negativos, barriendo hacia +z;
// el borde libre rezaga hacia -z, que con velocidad negativa exige signo positivo

function pasoResorte(resorte, objetivo, delta) {
    const aceleracion = RIGIDEZ * (objetivo - resorte.angulo) - AMORTIGUACION * resorte.velocidad;
    resorte.velocidad += aceleracion * delta;
    resorte.angulo += resorte.velocidad * delta;
    return resorte.angulo;
}

const CONTENIDO = [
    {
        etiqueta: 'BIENVENIDO A MI PORTAFOLIO',
        titulo: 'Dilan Solorzano',
        texto: 'Desarrollador frontend. Aquí encontrarás los proyectos en los que he trabajado.',
        pie: 'Toca la hoja para pasar →',
    },
    ...proyectos.map((p) => ({
        etiqueta: `PROYECTO ${p.id}`,
        titulo: p.titulo,
        texto: p.descripcion,
        pie: p.tecnologias.join(' · '),
    })),
];

function Hoja({ indice, pasada, activa, retrocedible, onPasar, onRetroceder, contenido }) {
    const grupoRef = useRef();
    const textoEtiquetaRef = useRef();
    const textoTituloRef = useRef();
    const textoCuerpoRef = useRef();
    const textoPieRef = useRef();
    const resorteRef = useRef({ angulo: 0, velocidad: 0 });
    const geometriaRef = useRef();
    const originalesRef = useRef(null);
    const curvandoRef = useRef(false);
    const opacidadRef = useRef(1);
    // La hoja 0 es la más cercana a la tapa delantera
    const z = GROSOR_PAGINAS / 2 - ESPACIO / 2 - indice * ESPACIO;
    const zTexto = ESPACIO * 0.45 + 0.001;
    const xTexto = 0.2;
    const anchoTexto = ANCHO - 0.4;
    const anchoHoja = ANCHO - 0.1;

    useFrame((_, deltaBruto) => {
        const geometria = geometriaRef.current;
        if (originalesRef.current === null) {
            originalesRef.current = geometria.attributes.position.array.slice();
        }
        const delta = Math.min(deltaBruto, 1 / 30);
        const resorte = resorteRef.current;
        const objetivo = pasada ? ANGULO_HOJA : 0;
        grupoRef.current.rotation.y = pasoResorte(resorte, objetivo, delta);

        const doblez = Math.tanh(resorte.velocidad / VELOCIDAD_DOBLEZ);
        const doblezAbs = Math.abs(doblez);

        grupoRef.current.position.z = z + ELEVACION * doblezAbs;

        const posicion = geometria.attributes.position;
        if (doblezAbs > 0.01) {
            curvandoRef.current = true;
            const arreglo = posicion.array;
            const originales = originalesRef.current;
            for (let i = 0; i < arreglo.length; i += 3) {
                const relativo = (originales[i] + anchoHoja / 2) / anchoHoja;
                arreglo[i + 2] = originales[i + 2] + SIGNO_CURVA * CURVATURA * doblez * relativo * relativo;
            }
            posicion.needsUpdate = true;
        } else if (curvandoRef.current) {
            curvandoRef.current = false;
            posicion.array.set(originalesRef.current);
            posicion.needsUpdate = true;
        }

        const opacidad = Math.max(0, 1 - doblezAbs * 2);
        if (opacidad !== opacidadRef.current) {
            opacidadRef.current = opacidad;
            textoEtiquetaRef.current.fillOpacity = opacidad;
            textoTituloRef.current.fillOpacity = opacidad;
            textoCuerpoRef.current.fillOpacity = opacidad;
            textoPieRef.current.fillOpacity = opacidad;
        }
    });

    const manejarClick = (e) => {
        if (activa) {
            e.stopPropagation();
            document.body.style.cursor = 'auto';
            onPasar();
        } else if (retrocedible) {
            e.stopPropagation();
            document.body.style.cursor = 'auto';
            onRetroceder();
        }
    };

    return (
        <group
            ref={grupoRef}
            position={[0, 0, z]}
            onClick={manejarClick}
            onPointerOver={() => {
                if (activa || retrocedible) document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
                document.body.style.cursor = 'auto';
            }}
        >
            <mesh position={[ANCHO / 2, 0, 0]}>
                <boxGeometry ref={geometriaRef} args={[anchoHoja, ALTO - 0.1, ESPACIO * 0.9, SEGMENTOS_HOJA]} />
                <meshStandardMaterial color={COLORES_HOJA[indice % 2]} />
            </mesh>

            <Suspense fallback={null}>
                <Text
                    ref={textoEtiquetaRef}
                    font={FUENTE}
                    position={[xTexto, 0.82, zTexto]}
                    fontSize={0.05}
                    letterSpacing={0.1}
                    color="#8a6a3a"
                    anchorX="left"
                    anchorY="top"
                    maxWidth={anchoTexto}
                >
                    {contenido.etiqueta}
                </Text>

                <Text
                    ref={textoTituloRef}
                    font={FUENTE}
                    position={[xTexto, 0.7, zTexto]}
                    fontSize={0.13}
                    color="#3a1a10"
                    anchorX="left"
                    anchorY="top"
                    maxWidth={anchoTexto}
                >
                    {contenido.titulo}
                </Text>

                <Text
                    ref={textoCuerpoRef}
                    font={FUENTE}
                    position={[xTexto, 0.45, zTexto]}
                    fontSize={0.075}
                    lineHeight={1.4}
                    color="#3a2a1a"
                    anchorX="left"
                    anchorY="top"
                    maxWidth={anchoTexto}
                >
                    {contenido.texto}
                </Text>

                <Text
                    ref={textoPieRef}
                    font={FUENTE}
                    position={[xTexto, -0.75, zTexto]}
                    fontSize={0.06}
                    color="#8a6a3a"
                    anchorX="left"
                    anchorY="bottom"
                    maxWidth={anchoTexto}
                >
                    {contenido.pie}
                </Text>
            </Suspense>
        </group>
    );
}

function Libro({ cerrando }) {
    const viewport = useThree((estado) => estado.viewport);
    const escala = Math.min(
        ESCALA_MAX,
        (viewport.height * OBJETIVO_ALTO) / ALTO,
        (viewport.width * (1 - MARGEN * 2)) / (ANCHO * 2),
        (viewport.height * (1 - MARGEN * 2)) / ALTO
    );
    const esMovil = viewport.aspect < 1;
    const xLomo = esMovil
        ? 0
        : -viewport.width / 2 + ANCHO * escala + MARGEN * viewport.width / 2;

    const mitad = GROSOR_PAGINAS / 2 + GROSOR_TAPA / 2;
    const tapaRef = useRef();
    const resorteTapaRef = useRef({ angulo: 0, velocidad: 0 });
    const [abierta, setAbierta] = useState(false);
    const [paginaActual, setPaginaActual] = useState(0);

    // Al cerrar, todo apunta al estado "cerrado" y las animaciones hacen el resto
    const abiertaVisible = abierta && !cerrando;
    const pagina = cerrando ? 0 : paginaActual;

    useEffect(() => {
        const temporizador = setTimeout(() => setAbierta(true), 1000);
        return () => clearTimeout(temporizador);
    }, []);

    useFrame((_, deltaBruto) => {
        const delta = Math.min(deltaBruto, 1 / 30);
        const objetivo = abiertaVisible ? ANGULO_ABIERTO : 0;
        tapaRef.current.rotation.y = pasoResorte(resorteTapaRef.current, objetivo, delta);
    });

    return (
        <group position={[xLomo, 0, 0]} rotation={[0.15, 0.4, 0]} scale={escala}>
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
            {CONTENIDO.map((contenido, i) => (
                <Hoja
                    key={i}
                    indice={i}
                    contenido={contenido}
                    pasada={i < pagina}
                    activa={abiertaVisible && i === pagina}
                    retrocedible={!cerrando && i === pagina - 1}
                    onPasar={() => setPaginaActual(i + 1)}
                    onRetroceder={() => setPaginaActual(i)}
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

function Libro3D({ onCerrar }) {
    const [cerrando, setCerrando] = useState(false);

    const cerrar = () => {
        if (cerrando) return;
        document.body.style.cursor = 'auto';
        setCerrando(true);
        setTimeout(onCerrar, TIEMPO_CIERRE);
    };

    return (
        <>
            <motion.div
                className="fondo-libro"
                initial={{ opacity: 0 }}
                animate={{ opacity: cerrando ? 0 : 1 }}
                transition={{ duration: 0.8 }}
            />

            <Canvas className="libro-canvas" camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={1.2} />
                <directionalLight position={[3, 3, 5]} intensity={2} />
                <Libro cerrando={cerrando} />
            </Canvas>

            <button className="boton-cerrar" onClick={cerrar}>
                Cerrar
            </button>
        </>
    );
}

export default Libro3D;
