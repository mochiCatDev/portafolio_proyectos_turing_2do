import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, Text } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { proyectos } from '../../data/proyectos';
import './Libro3D.css';

const ANCHO = 1.5;
const ALTO = 2;
const GROSOR_TAPA = 0.04;
const ESPACIO = 0.03;
const TOTAL_HOJAS = proyectos.length + 1; // intro + proyectos
const GROSOR_PAGINAS = (TOTAL_HOJAS + 1) * ESPACIO; // + contraportada
const COLOR_TAPA = '#1e3a8a';
const COLORES_HOJA = ['#f5f0e6', '#ebe4d5'];
const ANGULO_ABIERTO = -2.8;
const ANGULO_HOJA = -2.8;
const TIEMPO_CIERRE = 1800; // ms que dura la animación de cierre
const FUENTE = '/fonts/Lora-Regular.ttf';
const OBJETIVO_ALTO = 0.68; // fracción del alto visible que ocupa el libro cerrado
const MARGEN = 0.05; // margen de seguridad al abrir el libro
const ESCALA_MAX = 2; // límite superior de escala en pantallas muy grandes
const SEGMENTOS_HOJA = 20;
const GROSOR_HOJA = ESPACIO * 0.18; // grosor del mesh de la hoja (papel fino)
const RIGIDEZ = 30;
const AMORTIGUACION = 9;
const CURVATURA = 0.9;
const ONDULACION = 0.12; // término senoidal para la S suave a lo largo del ancho
const ELEVACION = 0.12;
const VELOCIDAD_DOBLEZ = 6;
const PESO_PROGRESO = 0.6; // aporte del progreso del giro al doblez (máx a mitad de giro)
const UMBRAL_TEXTO = 0.3; // progreso del giro (campana) a partir del cual el texto empieza a desvanecerse
const RANGO_TEXTO = 0.4; // ancho del desvanecimiento del texto
const SIGNO_CURVA = 1; // la hoja gira hacia ángulos negativos, barriendo hacia +z;
// el borde libre rezaga hacia -z, que con velocidad negativa exige signo positivo
const CURVA_BASE_PAGINA = 0.06; // arco leve permanente de la hoja hundida hacia el lomo
const RUGOSIDAD_TAPA = 0.7;
const METALICIDAD_TAPA = 0.05;
const RUGOSIDAD_PAPEL = 0.85;

function pasoResorte(resorte, objetivo, delta) {
    const aceleracion = RIGIDEZ * (objetivo - resorte.angulo) - AMORTIGUACION * resorte.velocidad;
    resorte.velocidad += aceleracion * delta;
    resorte.angulo += resorte.velocidad * delta;
    return resorte.angulo;
}

function crearLienzoCuero() {
    const lienzo = document.createElement('canvas');
    lienzo.width = 512;
    lienzo.height = 512;
    const ctx = lienzo.getContext('2d');
    ctx.fillStyle = COLOR_TAPA;
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 14000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.fillStyle = Math.random() > 0.5
            ? `rgba(10, 20, 60, ${0.04 + Math.random() * 0.08})`
            : `rgba(110, 150, 215, ${0.03 + Math.random() * 0.07})`;
        ctx.fillRect(x, y, 1 + Math.random() * 2, 1 + Math.random() * 2);
    }
    for (let i = 0; i < 60; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radio = 20 + Math.random() * 60;
        const degradado = ctx.createRadialGradient(x, y, 0, x, y, radio);
        degradado.addColorStop(0, `rgba(12, 24, 70, ${0.08 + Math.random() * 0.06})`);
        degradado.addColorStop(1, 'rgba(12, 24, 70, 0)');
        ctx.fillStyle = degradado;
        ctx.beginPath();
        ctx.arc(x, y, radio, 0, Math.PI * 2);
        ctx.fill();
    }
    return lienzo;
}

function crearLienzoBumpCuero() {
    const lienzo = document.createElement('canvas');
    lienzo.width = 512;
    lienzo.height = 512;
    const ctx = lienzo.getContext('2d');
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 16000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const gris = 100 + Math.floor(Math.random() * 110);
        ctx.fillStyle = `rgba(${gris}, ${gris}, ${gris}, ${0.3 + Math.random() * 0.5})`;
        ctx.fillRect(x, y, 1 + Math.random() * 2, 1 + Math.random() * 2);
    }
    return lienzo;
}

function crearLienzoRugosidadCuero() {
    const lienzo = document.createElement('canvas');
    lienzo.width = 256;
    lienzo.height = 256;
    const ctx = lienzo.getContext('2d');
    ctx.fillStyle = '#b3b3b3';
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 9000; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        const gris = 150 + Math.floor(Math.random() * 70);
        ctx.fillStyle = `rgba(${gris}, ${gris}, ${gris}, ${0.25 + Math.random() * 0.4})`;
        ctx.fillRect(x, y, 1 + Math.random() * 3, 1 + Math.random() * 3);
    }
    return lienzo;
}

function crearLienzosCantos() {
    const color = document.createElement('canvas');
    const bump = document.createElement('canvas');
    color.width = 256;
    color.height = 256;
    bump.width = 256;
    bump.height = 256;
    const ctxColor = color.getContext('2d');
    const ctxBump = bump.getContext('2d');
    const tonos = ['#f5f0e6', '#ebe4d5', '#f8f4ec', '#e6ddca'];
    for (let y = 0; y < 256; ) {
        const altura = 1 + Math.floor(Math.random() * 3);
        const tono = tonos[Math.floor(Math.random() * tonos.length)];
        ctxColor.fillStyle = tono;
        ctxColor.fillRect(0, y, 256, altura);
        const gris = 110 + Math.floor(Math.random() * 90);
        ctxBump.fillStyle = `rgb(${gris}, ${gris}, ${gris})`;
        ctxBump.fillRect(0, y, 256, altura);
        y += altura;
    }
    for (let i = 0; i < 800; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        ctxColor.fillStyle = `rgba(120, 100, 70, ${0.04 + Math.random() * 0.05})`;
        ctxColor.fillRect(x, y, 1 + Math.random() * 4, 1);
    }
    return { color, bump };
}

function texturaCanvas(lienzo, esColor, repeticion) {
    const textura = new THREE.CanvasTexture(lienzo);
    textura.wrapS = THREE.RepeatWrapping;
    textura.wrapT = THREE.RepeatWrapping;
    textura.repeat.set(repeticion[0], repeticion[1]);
    if (esColor) textura.colorSpace = THREE.SRGBColorSpace;
    return textura;
}

function crearTexturas() {
    const { color: cantosColor, bump: cantosBumpLienzo } = crearLienzosCantos();
    return {
        cuero: texturaCanvas(crearLienzoCuero(), true, [2, 1.5]),
        cueroBump: texturaCanvas(crearLienzoBumpCuero(), false, [2, 1.5]),
        cueroRugosidad: texturaCanvas(crearLienzoRugosidadCuero(), false, [2, 1.5]),
        cantos: texturaCanvas(cantosColor, true, [1, 1]),
        cantosBump: texturaCanvas(cantosBumpLienzo, false, [1, 1]),
    };
}

const PROPIEDADES_ORO = {
    color: '#c9a15a',
    metalness: 1,
    roughness: 0.35,
};

function propiedadesCuero(texturas) {
    return {
        map: texturas.cuero,
        bumpMap: texturas.cueroBump,
        bumpScale: 0.35,
        roughnessMap: texturas.cueroRugosidad,
        roughness: RUGOSIDAD_TAPA,
        metalness: METALICIDAD_TAPA,
        clearcoat: 0.15,
        clearcoatRoughness: 0.6,
    };
}

const CONTENIDO = [
    {
        etiqueta: 'BIENVENIDO A MI PORTAFOLIO',
        titulo: 'Dilan Solorzano',
        texto: 'Desarrollador frontend. Aquí encontrarás los proyectos en los que he trabajado.',
        pie: 'Toca la hoja para pasar →',
    },
    ...proyectos.map((p) => ({
        esProyecto: true,
        etiqueta: `PROYECTO ${p.id}`,
        titulo: p.titulo,
        texto: p.descripcion,
        imagen: p.imagen,
        url: p.url,
        pie: p.tecnologias.join(' · '),
    })),
];

function ImagenHoja({ url, posicion, ancho, alto }) {
    const [textura] = useState(() => {
        const cargador = new THREE.TextureLoader();
        const t = cargador.load(url);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
    });
    const [lista, setLista] = useState(false);

    useEffect(() => {
        const alCargar = () => setLista(true);
        textura.addEventListener('load', alCargar);
        return () => textura.removeEventListener('load', alCargar);
    }, [textura]);

    return (
        <mesh position={posicion} visible={lista}>
            <planeGeometry args={[ancho, alto]} />
            <meshStandardMaterial map={textura} roughness={0.9} />
        </mesh>
    );
}

function BotonEntrar({ url, posicion, activo }) {
    const manejarClick = (e) => {
        e.stopPropagation();
        if (activo && url) window.open(url, '_blank', 'noopener');
    };

    return (
        <group position={posicion} onClick={manejarClick}>
            <mesh>
                <boxGeometry args={[0.55, 0.16, 0.012]} />
                <meshStandardMaterial {...PROPIEDADES_ORO} />
            </mesh>
            <Text
                fontSize={0.07}
                color="#1e3a8a"
                anchorX="center"
                anchorY="middle"
                position={[0, 0, 0.008]}
            >
                Entrar
            </Text>
        </group>
    );
}

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
    const zTexto = GROSOR_HOJA / 2 + 0.015; // separación amplia para evitar el duplicado por z-fighting
    const xTexto = 0.2;
    const anchoTexto = ANCHO - 0.4;
    const anchoHoja = ANCHO - 0.1;

    useFrame((_, deltaBruto) => {
        const geometria = geometriaRef.current;
        if (originalesRef.current === null) {
            const posicionInicial = geometria.attributes.position;
            const arregloInicial = posicionInicial.array;
            for (let i = 0; i < arregloInicial.length; i += 3) {
                const relativo = (arregloInicial[i] + anchoHoja / 2) / anchoHoja;
                arregloInicial[i + 2] -= CURVA_BASE_PAGINA * Math.pow(1 - relativo, 2);
            }
            posicionInicial.needsUpdate = true;
            geometria.computeVertexNormals();
            originalesRef.current = arregloInicial.slice();
        }
        const delta = Math.min(deltaBruto, 1 / 30);
        const resorte = resorteRef.current;
        const objetivo = pasada ? ANGULO_HOJA : 0;
        grupoRef.current.rotation.y = pasoResorte(resorte, objetivo, delta);

        const doblezVelocidad = Math.tanh(resorte.velocidad / VELOCIDAD_DOBLEZ);
        const progreso = Math.min(1, Math.max(0, resorte.angulo / ANGULO_HOJA));
        const campana = 4 * progreso * (1 - progreso);
        const doblezProgreso = PESO_PROGRESO * campana;
        let doblez = doblezVelocidad;
        if (Math.abs(doblez) < doblezProgreso) {
            const direccion = resorte.velocidad !== 0
                ? Math.sign(resorte.velocidad)
                : Math.sign(objetivo - resorte.angulo);
            doblez = direccion * doblezProgreso;
        }
        const doblezAbs = Math.abs(doblez);

        grupoRef.current.position.z = z + ELEVACION * doblezAbs;

        const posicion = geometria.attributes.position;
        if (doblezAbs > 0.01) {
            curvandoRef.current = true;
            const arreglo = posicion.array;
            const originales = originalesRef.current;
            for (let i = 0; i < arreglo.length; i += 3) {
                const relativo = (originales[i] + anchoHoja / 2) / anchoHoja;
                const perfil = relativo * relativo + ONDULACION * Math.sin(relativo * Math.PI * 2);
                arreglo[i + 2] = originales[i + 2] + SIGNO_CURVA * CURVATURA * doblez * perfil;
            }
            posicion.needsUpdate = true;
            geometria.computeVertexNormals();
        } else if (curvandoRef.current) {
            curvandoRef.current = false;
            posicion.array.set(originalesRef.current);
            posicion.needsUpdate = true;
            geometria.computeVertexNormals();
        }

        const opacidad = Math.min(1, Math.max(0, 1 - (campana - UMBRAL_TEXTO) / RANGO_TEXTO));
        if (opacidad !== opacidadRef.current) {
            opacidadRef.current = opacidad;
            if (textoEtiquetaRef.current) textoEtiquetaRef.current.fillOpacity = opacidad;
            if (textoTituloRef.current) textoTituloRef.current.fillOpacity = opacidad;
            if (textoCuerpoRef.current) textoCuerpoRef.current.fillOpacity = opacidad;
            if (textoPieRef.current) textoPieRef.current.fillOpacity = opacidad;
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
            <mesh position={[ANCHO / 2, 0, 0]} castShadow receiveShadow>
                <boxGeometry ref={geometriaRef} args={[anchoHoja, ALTO - 0.1, GROSOR_HOJA, SEGMENTOS_HOJA]} />
                <meshStandardMaterial color={COLORES_HOJA[indice % 2]} roughness={RUGOSIDAD_PAPEL} />
            </mesh>

            <Suspense fallback={null}>
                {contenido.esProyecto ? (
                    <>
                        <Text
                            ref={textoTituloRef}
                            font={FUENTE}
                            position={[xTexto, 0.85, zTexto]}
                            fontSize={0.11}
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
                            position={[xTexto, 0.68, zTexto]}
                            fontSize={0.06}
                            lineHeight={1.35}
                            color="#3a2a1a"
                            anchorX="left"
                            anchorY="top"
                            maxWidth={anchoTexto}
                        >
                            {contenido.texto}
                        </Text>

                        <ImagenHoja
                            url={contenido.imagen}
                            posicion={[ANCHO / 2, -0.12, zTexto + 0.001]}
                            ancho={1.0}
                            alto={0.66}
                        />

                        <BotonEntrar
                            url={contenido.url}
                            posicion={[ANCHO / 2, -0.72, zTexto + 0.001]}
                            activo={activa}
                        />
                    </>
                ) : (
                    <>
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
                    </>
                )}
            </Suspense>
        </group>
    );
}

function Libro({ cerrando, texturas }) {
    const viewport = useThree((estado) => estado.viewport);
    // Lomo al centro para que el montón izquierdo de hojas pasadas quede a la vista
    const escala = Math.min(
        ESCALA_MAX,
        (viewport.height * OBJETIVO_ALTO) / ALTO,
        (viewport.width * (1 - MARGEN * 2)) / (ANCHO * 2),
        (viewport.height * (1 - MARGEN * 2)) / ALTO
    );
    const xLomo = 0;

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
        <group position={[xLomo, 0, 0]} rotation={[0.15, 0.2, 0]} scale={escala}>
            {/* Tapa trasera */}
            <mesh position={[ANCHO / 2, 0, -mitad]} castShadow receiveShadow>
                <boxGeometry args={[ANCHO, ALTO, GROSOR_TAPA]} />
                <meshPhysicalMaterial {...propiedadesCuero(texturas)} />
            </mesh>

            {/* Contraportada: la última página, fija */}
            <mesh position={[ANCHO / 2, 0, -GROSOR_PAGINAS / 2 + ESPACIO / 2]} castShadow receiveShadow>
                <boxGeometry args={[ANCHO - 0.1, ALTO - 0.1, ESPACIO * 0.9]} />
                <meshStandardMaterial color={COLORES_HOJA[TOTAL_HOJAS % 2]} roughness={RUGOSIDAD_PAPEL} />
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

            {/* Lomo: cuero azul en tapas y bordes, canto de páginas en la cara visible */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[GROSOR_TAPA, ALTO, GROSOR_PAGINAS + GROSOR_TAPA * 2]} />
                <meshPhysicalMaterial attach="material-0" {...propiedadesCuero(texturas)} />
                <meshPhysicalMaterial
                    attach="material-1"
                    map={texturas.cantos}
                    bumpMap={texturas.cantosBump}
                    bumpScale={0.5}
                    roughness={0.8}
                    metalness={0.02}
                />
                <meshPhysicalMaterial attach="material-2" {...propiedadesCuero(texturas)} />
                <meshPhysicalMaterial attach="material-3" {...propiedadesCuero(texturas)} />
                <meshPhysicalMaterial attach="material-4" {...propiedadesCuero(texturas)} />
                <meshPhysicalMaterial attach="material-5" {...propiedadesCuero(texturas)} />
            </mesh>

            {/* Detalles dorados tenues en los bordes del lomo */}
            <mesh position={[0, ALTO / 2 - 0.015, 0]} castShadow>
                <boxGeometry args={[GROSOR_TAPA + 0.008, 0.03, GROSOR_PAGINAS + GROSOR_TAPA * 2 + 0.008]} />
                <meshStandardMaterial color="#c9a15a" metalness={1} roughness={0.35} />
            </mesh>
            <mesh position={[0, -ALTO / 2 + 0.015, 0]} castShadow>
                <boxGeometry args={[GROSOR_TAPA + 0.008, 0.03, GROSOR_PAGINAS + GROSOR_TAPA * 2 + 0.008]} />
                <meshStandardMaterial color="#c9a15a" metalness={1} roughness={0.35} />
            </mesh>

            {/* Tapa delantera: el grupo es el pivote en el lomo */}
            <group ref={tapaRef} position={[0, 0, mitad]}>
                <mesh position={[ANCHO / 2, 0, 0]} castShadow receiveShadow>
                    <boxGeometry args={[ANCHO, ALTO, GROSOR_TAPA]} />
                    <meshPhysicalMaterial {...propiedadesCuero(texturas)} />
                </mesh>

                {/* Marco dorado de la pasta */}
                <mesh position={[ANCHO / 2, ALTO / 2 - 0.025, 0]}>
                    <boxGeometry args={[ANCHO, 0.05, GROSOR_TAPA + 0.006]} />
                    <meshStandardMaterial {...PROPIEDADES_ORO} />
                </mesh>
                <mesh position={[ANCHO / 2, -ALTO / 2 + 0.025, 0]}>
                    <boxGeometry args={[ANCHO, 0.05, GROSOR_TAPA + 0.006]} />
                    <meshStandardMaterial {...PROPIEDADES_ORO} />
                </mesh>
                <mesh position={[0.025, 0, 0]}>
                    <boxGeometry args={[0.05, ALTO, GROSOR_TAPA + 0.006]} />
                    <meshStandardMaterial {...PROPIEDADES_ORO} />
                </mesh>
                <mesh position={[ANCHO - 0.025, 0, 0]}>
                    <boxGeometry args={[0.05, ALTO, GROSOR_TAPA + 0.006]} />
                    <meshStandardMaterial {...PROPIEDADES_ORO} />
                </mesh>
            </group>
        </group>
    );
}

function Libro3D({ onCerrar }) {
    const [cerrando, setCerrando] = useState(false);
    const [texturas] = useState(crearTexturas);

    useEffect(() => () => {
        Object.values(texturas).forEach((textura) => textura.dispose());
    }, [texturas]);

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

            <Canvas
                className="libro-canvas"
                camera={{ position: [0, 0, 5], fov: 45 }}
                gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
            >
                <Environment resolution={256} frames={1} background={false}>
                    <color attach="background" args={['#111827']} />
                    <Lightformer intensity={2.2} color="#ffd9a0" position={[-3, 2, 4]} scale={[4, 4, 1]} />
                    <Lightformer intensity={1.2} color="#ffffff" position={[0, 5, -3]} scale={[6, 3, 1]} />
                    <Lightformer intensity={0.6} color="#a8c4ff" position={[4, 1, 2]} scale={[3, 3, 1]} />
                </Environment>
                <ambientLight intensity={0.2} />
                <directionalLight color="#ffd9a0" intensity={2.2} position={[-3, 2, 4]} />
                <directionalLight color="#a8c4ff" intensity={0.35} position={[4, 1, 2]} />
                <directionalLight color="#dbe9ff" intensity={1.1} position={[1.5, 3, -3.5]} />
                <Libro cerrando={cerrando} texturas={texturas} />
            </Canvas>

            <button className="boton-cerrar" onClick={cerrar}>
                Cerrar
            </button>
        </>
    );
}

export default Libro3D;
