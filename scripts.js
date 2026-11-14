// ==================================
// 1. Inicio
// ==================================

const hearts = document.querySelectorAll(".heart-option");
const progress = document.getElementById("game-progress");
const unlockButton = document.getElementById("unlock-button");

let foundHearts = 0;

hearts.forEach((heart) => {

    heart.addEventListener("click", () => {

        if (heart.classList.contains("found")) {
            return;
        }

        heart.classList.add("found");
        heart.textContent = "♥";
        foundHearts++;

        progress.textContent =
            `Corazones encontrados: ${foundHearts}/3`;

        if (foundHearts === 3) {
            progress.textContent = "🌷Te amo🌻";
            unlockButton.disabled = false;
        }

    });

});


// ==================================
// 2. desbloquear carta
// ==================================

const gameScreen = document.getElementById("game-screen");
const envelopeScreen = document.getElementById("envelope-screen");

unlockButton.addEventListener("click", () => {

    gameScreen.classList.add("hidden");
    envelopeScreen.classList.remove("hidden");

});


// ==================================
// 3. abrir carta
// ==================================

const envelope = document.getElementById("envelope");
const letterScreen = document.getElementById("letter-screen");
const envelopeHint = document.getElementById("envelope-hint");

let envelopeOpened = false;

envelope.addEventListener("click", () => {

    if (envelopeOpened) {
        return;
    }

    envelopeOpened = true;

    envelope.classList.add("open");
    envelopeHint.textContent = "Tu sorpresa está lista... 💗";

    setTimeout(() => {

        envelopeScreen.classList.add("hidden");
        letterScreen.classList.remove("hidden");

        document.getElementById("music-button")
            .classList.remove("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }, 1600);

});

// ==================================
// 5. BOTON DE LA SORPRESA FINAL
// ==================================

const surpriseButton = document.getElementById("surprise-button");
const surpriseContent = document.getElementById("surprise-content");

surpriseButton.addEventListener("click", () => {

    surpriseContent.classList.toggle("hidden");

    if (surpriseContent.classList.contains("hidden")) {
        surpriseButton.textContent = "Descubrir sorpresa ✨";
    } else {
        surpriseButton.textContent = "Ocultar sorpresa ♡";
    }

});

// ==================================
// 7. CORAZONES, FLORES Y PARTICULAS
// ==================================

const particlesContainer = document.getElementById("particles");

const particleSymbols = [
    "♡", "♥", "ღ",
    "🌸", "🌷", "✿", "❀", 
    "✧", "✨", "❁", "💗", "💖", "💘", "💝", "💕"
];

function createParticle() {

    const particle = document.createElement("span");

    particle.classList.add("particle");

    // Elegir un simbolo aleatorio
    particle.textContent =
        particleSymbols[
            Math.floor(Math.random() * particleSymbols.length)
        ];

    // Posicion horizontal aleatoria
    particle.style.left = Math.random() * 100 + "%";

    // Tamaño aleatorio
    particle.style.fontSize =
        (Math.random() * 22 + 12) + "px";

    // Velocidad aleatoria
    const duration = Math.random() * 8 + 7;

    particle.style.animationDuration = duration + "s";

    // Colores aleatorios
    const colors = [
        "#f2a9c7",
        "#e8b4d8",
        "#c9a9e8",
        "#f5c6dc",
        "#d8b5ef"
    ];

    particle.style.color =
        colors[Math.floor(Math.random() * colors.length)];

    // Transparencia
    particle.style.opacity = Math.random() * 0.5 + 0.3;

    particlesContainer.appendChild(particle);

    // Eliminar al terminar la animacion
    setTimeout(() => {
        particle.remove();
    }, duration * 1000);

}

// Crear particulas continuamente
setInterval(createParticle, 250);
// Crear partículas continuamente

setInterval(createParticle, 650);


