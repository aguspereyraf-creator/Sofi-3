
const canvas = document.getElementById("juego");
const ctx = canvas.getContext("2d");

const botonInicio = document.getElementById("botonInicio");
const pantallaMensaje = document.getElementById("pantallaMensaje");
const tituloMensaje = document.getElementById("tituloMensaje");
const textoMensaje = document.getElementById("textoMensaje");
const botonMensaje = document.getElementById("botonMensaje");
const imagenDerrota = document.getElementById("imagenDerrota");

// =================================
// CARGAR IMAGENES
// =================================

const imagenChica = new Image();
imagenChica.src = "assets/chica.png";

const imagenCaminando = new Image();
imagenCaminando.src = "assets/chica_caminando.png";

const imagenTikTok = new Image();
imagenTikTok.src = "assets/tiktok.png";

const imagenIG = new Image();
imagenIG.src = "assets/ig.png";

// =================================
// PERSONAJE
// =================================

const chica = {
    x: 275,
    y: 525,
    ancho: 50,
    alto: 60,
    velocidad: 5,
    caminando: false,
    direccion: "derecha"
};

// =================================
// VARIABLES DEL JUEGO
// =================================

let puntos = 0;
let vidas = 5;
let nivel = 1;

let corazones = [];
let enemigos = [];

let corazonesNivel = 0;
let fotograma = 0;

let jugando = false;
let estadoJuego = "inicio";

const teclas = {};

// =================================
// CONFIGURACION DE NIVELES
// =================================

const configuracionNiveles = {

    1: {
        velocidadTikTok: 2.5,
        frecuenciaTikTok: 85,
        frecuenciaCorazon: 55
    },

    2: {
        velocidadIG: 3.5,
        frecuenciaIG: 25,
        frecuenciaCorazon: 60
    },

    3: {
        velocidadTikTok: 4,
        velocidadIG: 4.5,
        frecuenciaTikTok: 35,
        frecuenciaIG: 30,
        frecuenciaCorazon: 105
    }

};

// =================================
// TECLADO
// =================================

document.addEventListener("keydown", (e) => {

    teclas[e.key.toLowerCase()] = true;

    if (
        ["arrowleft", "arrowright"].includes(e.key.toLowerCase())
    ) {
        e.preventDefault();
    }

});

document.addEventListener("keyup", (e) => {

    teclas[e.key.toLowerCase()] = false;

});

// =================================
// ACTUALIZAR INFORMACION
// =================================

function actualizarInformacion() {

    document.getElementById("puntos").textContent = puntos;

    document.getElementById("vidas").textContent =
        "❤️".repeat(vidas);

    document.getElementById("nivel").textContent = nivel;

}

// =================================
// MOVIMIENTO DE LA CHICA
// =================================

function moverChica() {

    chica.caminando = false;

    if (teclas["arrowleft"] || teclas["a"]) {

        chica.x -= chica.velocidad;
        chica.caminando = true;
        chica.direccion = "izquierda";

    }

    if (teclas["arrowright"] || teclas["d"]) {

        chica.x += chica.velocidad;
        chica.caminando = true;
        chica.direccion = "derecha";

    }

    chica.x = Math.max(
        0,
        Math.min(canvas.width - chica.ancho, chica.x)
    );

}

// =================================
// DIBUJAR CHICA
// =================================

function dibujarChica() {

    const imagenActual = chica.caminando
        ? imagenCaminando
        : imagenChica;

    if (!imagenActual.complete || imagenActual.naturalWidth === 0) {
        return;
    }

    ctx.save();

    if (chica.direccion === "izquierda") {

        ctx.translate(
            chica.x + chica.ancho,
            chica.y
        );

        ctx.scale(-1, 1);

        ctx.drawImage(
            imagenActual,
            0,
            0,
            chica.ancho,
            chica.alto
        );

    } else {

        ctx.drawImage(
            imagenActual,
            chica.x,
            chica.y,
            chica.ancho,
            chica.alto
        );

    }

    ctx.restore();

}

// =================================
// CREAR CORAZONES
// =================================

function crearCorazon() {

    corazones.push({

        x: Math.random() * (canvas.width - 35),
        y: -35,

        ancho: 32,
        alto: 32,

        velocidad: nivel === 3 ? 3 : 2.5

    });

}

// =================================
// CREAR ENEMIGOS
// =================================

function crearEnemigo(tipo) {

    const configuracion = configuracionNiveles[nivel];

    let velocidad;

    if (tipo === "tiktok") {
        velocidad = configuracion.velocidadTikTok;
    } else {
        velocidad = configuracion.velocidadIG;
    }

    enemigos.push({

        x: Math.random() * (canvas.width - 45),
        y: -45,

        ancho: 42,
        alto: 42,

        velocidad: velocidad,
        tipo: tipo

    });

}

// =================================
// DIBUJAR CORAZONES
// =================================

function dibujarCorazones() {

    ctx.font = "30px Arial";
    ctx.textAlign = "center";

    corazones.forEach((corazon) => {

        ctx.fillText(
            "❤️",
            corazon.x + 16,
            corazon.y + 27
        );

    });

}

// =================================
// DIBUJAR ENEMIGOS
// =================================

function dibujarEnemigos() {

    enemigos.forEach((enemigo) => {

        let imagen;

        if (enemigo.tipo === "tiktok") {
            imagen = imagenTikTok;
        } else {
            imagen = imagenIG;
        }

        if (imagen.complete && imagen.naturalWidth > 0) {

            ctx.drawImage(
                imagen,
                enemigo.x,
                enemigo.y,
                enemigo.ancho,
                enemigo.alto
            );

        }

    });

}

// =================================
// DETECTAR COLISIONES
// =================================

function hayColision(a, b) {

    return (

        a.x < b.x + b.ancho &&
        a.x + a.ancho > b.x &&
        a.y < b.y + b.alto &&
        a.y + a.alto > b.y

    );

}

// =================================
// PERDER UNA VIDA
// =================================

function perderVida() {

    vidas--;

    actualizarInformacion();

    if (vidas <= 0) {

        finalizarJuego("derrota");

        return true;

    }

    return false;

}

// =================================
// ACTUALIZAR CORAZONES
// =================================

function actualizarCorazones() {

    for (let i = corazones.length - 1; i >= 0; i--) {

        const corazon = corazones[i];

        corazon.y += corazon.velocidad;

        if (hayColision(chica, corazon)) {

            puntos++;
            corazonesNivel++;

            corazones.splice(i, 1);

            actualizarInformacion();

            if (corazonesNivel >= (nivel === 3 ? 5 : 10)) {

                completarNivel();

                return;

            }

        }

        else if (corazon.y > canvas.height) {

            corazones.splice(i, 1);

            if (nivel === 3) {

                if (perderVida()) {
                    return;
                }

            }

        }

    }

}

// =================================
// ACTUALIZAR ENEMIGOS
// =================================

function actualizarEnemigos() {

    for (let i = enemigos.length - 1; i >= 0; i--) {

        const enemigo = enemigos[i];

        enemigo.y += enemigo.velocidad;

        if (hayColision(chica, enemigo)) {

            enemigos.splice(i, 1);

            if (perderVida()) {
                return;
            }

        }

        else if (enemigo.y > canvas.height) {

            enemigos.splice(i, 1);

        }

    }

}

// =================================
// GENERAR OBJETOS SEGUN EL NIVEL
// =================================

function generarObjetos() {

    const configuracion = configuracionNiveles[nivel];

    // NIVEL 1: TIKTOK

    if (nivel === 1) {

        if (fotograma % configuracion.frecuenciaTikTok === 0) {
            crearEnemigo("tiktok");
        }

    }

    // NIVEL 2: INSTAGRAM

    else if (nivel === 2) {

        if (fotograma % configuracion.frecuenciaIG === 0) {
            crearEnemigo("ig");
        }

    }

    // NIVEL 3: TIKTOK E INSTAGRAM

    else if (nivel === 3) {

        if (fotograma % configuracion.frecuenciaTikTok === 0) {
            crearEnemigo("tiktok");
        }

        if (fotograma % configuracion.frecuenciaIG === 0) {
            crearEnemigo("ig");
        }

    }

    // GENERAR CORAZONES

    if (fotograma % configuracion.frecuenciaCorazon === 0) {
        crearCorazon();
    }

}

// =================================
// DIBUJAR ESCENARIO
// =================================

function dibujarEscenario() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dibujarChica();
    dibujarCorazones();
    dibujarEnemigos();

}

// =================================
// COMPLETAR NIVEL
// =================================

function completarNivel() {

    jugando = false;

    corazones = [];
    enemigos = [];

    if (nivel === 3) {

        finalizarJuego("victoria");

        return;

    }

    estadoJuego = "transicion";

    tituloMensaje.textContent = "¡NIVEL COMPLETADO!";

    textoMensaje.textContent =
        "Muy bien sofi, pasaste el nivel " +
        nivel + ". pasa al siguiente :3.";

    botonMensaje.textContent = "IR AL NIVEL " + (nivel + 1);

    imagenDerrota.style.display = "none";

    pantallaMensaje.style.display = "block";

}

// =================================
// SIGUIENTE NIVEL
// =================================

function siguienteNivel() {
    nivel++;

    puntos = 0;
    corazonesNivel = 0;
    fotograma = 0;

    corazones = [];
    enemigos = [];

    chica.x = 275;
    chica.caminando = false;
    chica.direccion = "derecha";

    actualizarInformacion();

    pantallaMensaje.style.display = "none";
    estadoJuego = "jugando";
    jugando = true;

    actualizarJuego();
}

// =================================
// FINALIZAR JUEGO
// =================================

function finalizarJuego(resultado) {

    jugando = false;

    estadoJuego = resultado;

    Object.keys(teclas).forEach(tecla => {
        teclas[tecla] = false;
    });

    corazones = [];
    enemigos = [];

    dibujarEscenario();

    if (resultado === "derrota") {

        tituloMensaje.textContent = "¡GAME OVER!";

        textoMensaje.textContent =
            "Te quedaste viendo tiktoks, agus se enojo, intenta nuevamente";

        imagenDerrota.style.display = "block";

        botonMensaje.textContent = "REINTENTAR NIVEL";

    }

    if (resultado === "victoria") {

        tituloMensaje.textContent = "¡FELICIDADES!";

        textoMensaje.textContent =
            "¡Ganaste el juego mi amor, felicidades :3!";

        imagenDerrota.style.display = "none";

        botonMensaje.textContent = "JUGAR DE NUEVO";

    }

    pantallaMensaje.style.display = "block";

}

// =================================
// REINICIAR NIVEL ACTUAL
// =================================

function reiniciarNivel() {
    vidas = 5;

    puntos = 0;
    corazonesNivel = 0;
    fotograma = 0;

    corazones = [];
    enemigos = [];

    chica.x = 275;
    chica.caminando = false;
    chica.direccion = "derecha";

    Object.keys(teclas).forEach(tecla => {
        teclas[tecla] = false;
    });

    actualizarInformacion();

    pantallaMensaje.style.display = "none";
    estadoJuego = "jugando";
    jugando = true;

    dibujarEscenario();
    actualizarJuego();
}

// =================================
// BUCLE PRINCIPAL
// =================================

function actualizarJuego() {

    if (!jugando) return;

    fotograma++;

    moverChica();

    generarObjetos();

    actualizarCorazones();

    if (!jugando) return;

    actualizarEnemigos();

    if (!jugando) return;

    dibujarEscenario();

    requestAnimationFrame(actualizarJuego);

}

// =================================
// INICIAR PARTIDA NUEVA
// =================================

function iniciarJuego() {

    puntos = 0;
    vidas = 5;
    nivel = 1;

    corazonesNivel = 0;
    fotograma = 0;

    corazones = [];
    enemigos = [];

    chica.x = 275;
    chica.caminando = false;
    chica.direccion = "derecha";

    Object.keys(teclas).forEach(tecla => {
        teclas[tecla] = false;
    });

    actualizarInformacion();

    pantallaMensaje.style.display = "none";
    botonInicio.style.display = "none";

    estadoJuego = "jugando";
    jugando = true;

    dibujarEscenario();

    actualizarJuego();

}

// =================================
// BOTONES
// =================================

botonInicio.addEventListener("click", iniciarJuego);

botonMensaje.addEventListener("click", () => {

    if (estadoJuego === "transicion") {

        siguienteNivel();

    }

    else if (estadoJuego === "derrota") {

        reiniciarNivel();

    }

    else if (estadoJuego === "victoria") {

        iniciarJuego();

    }

});

// =================================
// PANTALLA INICIAL
// =================================

actualizarInformacion();

dibujarEscenario();
