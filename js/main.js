// main.js

let data = null;

// Cargar el archivo JSON
fetch('./historia_mesoamericana_completo.json')
    .then(res => res.json())
    .then(json => {
        data = json;
        console.log("✅ JSON cargado con éxito");
    });

function normalizarTexto(texto) {
    return texto
        .normalize("NFD") // separa letras de tildes
        .replace(/[\u0300-\u036f]/g, "") // elimina acentos
        .replace(/[^\w\s]/gi, "") // elimina signos de puntuación
        .toLowerCase()
        .trim();
}

const palabrasHistoria = [
    "historia", "origen", "quienes fueron", "quien fue", "quienes son", "quienes eran", "quien era", "quien es", "quienes eran", "quienes son",
    "quien es", "que son", "que fueron", "que eran", "que era", "que es", "hablarme", "hablame", "hablame de", "contarme", "que paso", "que",
    "cuéntame", "háblame", "cuéntame sobre", "háblame sobre",
    "cuéntame de", "háblame de", "cuéntame acerca de", "háblame acerca de",
    "cuéntame la historia de", "háblame la historia de"
];

const palabrasDioses = [
    "dios", "dioses", "deidad", "deidades", "divinidad", "divinidades"
];

const palabrasUbicacion = [
    "ubicación", "donde se ubica", "donde se encuentra", "donde se localiza", "localización",
    "ciudad", "habitaban", "ciudades", "ciudad de", "ciudades de", "ubicación de",
    "donde vivían", "donde habitaban", "donde se ubicaban", "donde se encontraban"
];

const palabrasAportaciones = [
    "aportación", "aportaciones", "aporte", "aportaron", "aporto", "aportó",
    "contribución", "contribuciones", "contribuyó"
];

const palabrasSaludos = [
    "hola", "buenas", "buen día", "buenas tardes", "buenas noches"
];

const palabrasDespedidas = [
    "adiós", "hasta luego", "nos vemos", "chau", "chao", "hasta pronto"
];

const palabrasAgradecimientos = [
    "gracias", "muchas gracias", "te agradezco", "agradezco", "agradecido", "agradecida",
    "mil gracias", "te lo agradezco", "se lo agradezco"
];

const palabrasReanudacion = [
    "de nuevo", "regrese", "regresado", "otra vez", "volver a empezar"
];

const palabrasAyuda = [
    "ayuda", "cómo funciona", "qué puedo hacer", "qué puedes hacer", "necesito ayuda"
];

const palabrasPreguntas = [
    "cuando", "donde", "quien", "quienes", "que", "cual", "cuáles",
    "por qué", "cómo"
];

const palabrasMaterial = [
    "material", "hecho de", "de qué está hecho", "de que está hecho", "de qué material es"
];

const palabrasDatoCurioso = [
    "dato curioso", "dato interesante", "dato raro", "sorprendente",
    "sabias que", "algo curioso", "cuentame algo curioso", "quiero un dato curioso",
    "un dato", "curioso"
];

const palabrasPreguntasTrivia = [
    "hazme una trivia", "pregunta trivia", "hazme una pregunta", "pregúntame algo", "quiero una pregunta"
];

function contienePalabraClave(pregunta, claves) {
    return claves.some(p => pregunta.includes(p));
}

function calcularSimilitud(a, b) {
    a = normalizarTexto(a);
    b = normalizarTexto(b);
    const palabrasA = a.split(" ");
    const palabrasB = b.split(" ");
    let coincidencias = 0;

    for (const palabra of palabrasA) {
        if (palabrasB.includes(palabra)) {
            coincidencias++;
        }
    }

    return coincidencias / Math.max(palabrasA.length, palabrasB.length);
}

function iniciarTrivia() {
    if (!data || !data.preguntas) return;

    const trivia = data.preguntas[Math.floor(Math.random() * data.preguntas.length)];

    document.getElementById("modalTrivia").style.display = "block";
    document.getElementById("preguntaTrivia").textContent = trivia.pregunta;
    document.getElementById("respuestaTrivia").value = "";
    document.getElementById("retroTrivia").textContent = "";

    hablar("Escucha con atención. " + trivia.pregunta);

    window.triviaActual = trivia;
}

function cerrarModalTrivia() {
    const modal = document.getElementById("modalTrivia");
    if (modal) modal.style.display = "none";
}

function verificarTrivia() {
    const respuestaUsuario = document.getElementById("respuestaTrivia").value.trim().toLowerCase();
    const trivia = window.triviaActual;
    if (!trivia) return;

    const respuestaCorrecta = trivia.respuesta.trim().toLowerCase();
    const retro = document.getElementById("retroTrivia");

    const similitud = calcularSimilitud(respuestaUsuario, respuestaCorrecta);

    if (similitud >= 0.4) {
        retro.textContent = "✅ ¡Correcto! " + trivia.respuesta;
        retro.style.color = "green";
        hablar("¡Muy bien! Eso es correcto.");
        setTimeout(() => {
            cerrarModalTrivia();
        }, 5000);
    } else {
        retro.textContent = "❌ Incorrecto. " + trivia.respuesta;
        retro.style.color = "red";
        hablar("No es correcto. La respuesta correcta es: " + trivia.respuesta);
    }
}

function responderPregunta(userQuestion, data) {
    const pregunta = normalizarTexto(userQuestion);

    if (
        contienePalabraClave(pregunta, palabrasPreguntasTrivia)
    ) {
        iniciarTrivia();
        return "¡Claro! Aquí tienes una pregunta de trivia.";
    }

    if (contienePalabraClave(pregunta, palabrasReanudacion)) {
        const saludo = data.mensajes_sistema.reanudacion;
        return saludo[Math.floor(Math.random() * saludo.length)];
    } else if (contienePalabraClave(pregunta, palabrasSaludos)) {
        const saludo = data.mensajes_sistema.bienvenida;
        return saludo[Math.floor(Math.random() * saludo.length)];
    }

    if (contienePalabraClave(pregunta, palabrasDespedidas)) {
        const bye = data.mensajes_sistema.despedida;
        return bye[Math.floor(Math.random() * bye.length)];
    }

    if (contienePalabraClave(pregunta, palabrasAgradecimientos)) {
        const gracias = data.mensajes_sistema.agradecimientos;
        return gracias[Math.floor(Math.random() * gracias.length)];
    }

    if (contienePalabraClave(pregunta, palabrasAyuda)) {
        const ayuda = data.mensajes_sistema.ayuda;
        return ayuda[Math.floor(Math.random() * ayuda.length)];
    }

    const question = data.preguntas.find(p => {
        const pNorm = normalizarTexto(p.pregunta);
        return pregunta.includes(pNorm);
    });

    if (question) {
        if (contienePalabraClave(pregunta, palabrasHistoria)) {
            return `${question.respuesta}`;
        }
    }

    const match = data.preguntas.find(p => pregunta.includes(p.pregunta.toLowerCase()));
    if (match) return match.respuesta;

    for (const obra of data.obras_destacadas) {
        const nombreObra = obra.nombre.toLowerCase();
        if (pregunta.includes(nombreObra)) {
            if (contienePalabraClave(pregunta, palabrasUbicacion)) {
                return `La ubicación de ${obra.nombre} (${obra.civilizacion}) es: ${obra.ubicacion.join(", ")}`;
            }
            if (contienePalabraClave(pregunta, palabrasMaterial)) {
                return `El material de ${obra.nombre} (${obra.civilizacion}) es principalmente ${obra.material}.`;
            }
            return `• ${obra.nombre} (${obra.civilizacion}): ${obra.descripcion}`;
        }
    }

    const civ = data.civilizaciones.find(c => {
        const nombre = normalizarTexto(c.nombre);
        return (
            pregunta.includes(nombre) ||
            pregunta.includes(nombre + "s") || // mayas
            pregunta.includes("los " + nombre) ||
            pregunta.includes("las " + nombre) ||
            pregunta.includes("los " + nombre + "s") ||
            pregunta.includes("las " + nombre + "s")
        );
    });

    if (civ) {
        if (
            contienePalabraClave(pregunta, palabrasHistoria)
        ) {
            return `Historia de la civilización ${civ.nombre}:\n${civ.descripcion}`;
        }
        if (
            contienePalabraClave(pregunta, palabrasDioses)
        ) {
            return civ.dioses.map(d => `• ${d.nombre}: ${d.descripcion}`).join("\n");
        }
        if (
            contienePalabraClave(pregunta, palabrasUbicacion)
        ) {
            return `Ciudades de ${civ.nombre}:
•  ${civ.ciudades.join("\n• ")}`;
        }
        if (
            contienePalabraClave(pregunta, palabrasAportaciones)
        ) {
            return `Aportaciones de ${civ.nombre}:
${civ.aportaciones.map(a => {
                if (typeof a === "string") return `• ${a}`;
                const clave = Object.keys(a)[0];
                return `• ${clave}: ${a[clave]}`;
            }).join("\n")}`;
        }
        return `¿Qué deseas saber sobre la civilización ${civ.nombre}?`;
    }

    for (const c of data.civilizaciones) {
        for (const d of c.dioses) {
            if (pregunta.includes(d.nombre.toLowerCase())) {
                return `• ${d.nombre} (${c.nombre}): ${d.descripcion}`;
            }
        }
    }

    for (const categoria in data.dioses_indexados) {
        const listaDioses = data.dioses_indexados[categoria];

        for (const dios of listaDioses) {
            const nombreDios = normalizarTexto(dios.nombre);
            if (
                contienePalabraClave(pregunta, palabrasHistoria) &&
                pregunta.includes(nombreDios)
            ) {
                return `• ${dios.nombre} (${dios.civilizacion}): ${dios.descripcion}`;
            }
        }
    }

    const curioso = data.datos_curiosos.find(dc => {
        const tema = normalizarTexto(dc.tema);
        return pregunta.includes(tema);
    });

    if (curioso) {
        if (contienePalabraClave(pregunta, palabrasHistoria)) {
            return `${curioso.tema}:\n${curioso.contenido}`;
        }
    }

    for (const tipo in data.dioses_indexados) {
        for (const d of data.dioses_indexados[tipo]) {
            if (pregunta.includes(d.nombre.toLowerCase())) {
                return `• ${d.nombre} (${d.civilizacion}): ${d.descripcion}`;
            }
        }
        if (pregunta.includes(tipo)) {
            return `Dioses relacionados con ${tipo}: ${data.dioses_indexados[tipo].map(d =>
                `• ${d.nombre} (${d.civilizacion}): ${d.descripcion}`
            ).join("\n")}`;
        }
    }

    const eve = data.eventos_historicos.find(e => {
        const nombreEvento = normalizarTexto(e.nombre);
        return pregunta.includes(nombreEvento);
    });

    if (eve) {
        if (pregunta.includes("año") || pregunta.includes("fecha")) {
            return `El evento ${eve.nombre} ocurrió en el año ${eve.año}.`;
        } if (contienePalabraClave(pregunta, palabrasPreguntas)) {
            return `${eve.nombre} ubicado en ${eve.ubicacion} en el año de ${eve.año}: ${eve.descripcion} en donde destacan ${eve.actores_clave.join(", ")}.`;
        }
    }

    const bio = data.biografias.find(b => {
        const nombreBio = normalizarTexto(b.nombre);
        return (
            pregunta.includes(nombreBio) ||
            pregunta.includes("la " + nombreBio)
        );
    });

    if (bio) {
        if (
            contienePalabraClave(pregunta, palabrasHistoria)
        ) {
            return `${bio.nombre} (${bio.periodo}): Fue un ${bio.rol}. ${bio.descripcion}`;
        }
    }


    if (contienePalabraClave(pregunta, palabrasDatoCurioso)) {
        const dato = data.datos_curiosos[Math.floor(Math.random() * data.datos_curiosos.length)];
        return `Dato curioso sobre ${dato.tema}:\n${dato.contenido}`;
    }


    const fallback = data?.mensajes_sistema?.respuesta_invalida || ["No entendí la pregunta."];
    return fallback[Math.floor(Math.random() * fallback.length)];
}

function mostrarInformacionObraAFrame(nombreObra) {
    if (!data || !data.obras_destacadas) return;

    const obra = data.obras_destacadas.find(o =>
        normalizarTexto(o.nombre) === normalizarTexto(nombreObra)
    );

    if (!obra) return;

    const mensaje = `• ${obra.nombre} (${obra.civilizacion})\n\n${obra.descripcion}`;

    const panel = document.querySelector("#info-panel");
    const texto = document.querySelector("#info-text");

    if (panel && texto) {
        texto.setAttribute("troika-text", `value: ${mensaje}`);
        panel.setAttribute("visible", true);
    }

    hablar(mensaje);
    agregarAlChat("respuesta", mensaje);
}



function hablar(texto) {
    if (!texto || typeof texto !== "string" || texto.trim() === "") {
        console.warn("⚠️ Texto inválido para hablar.");
        return;
    }

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(texto.trim());
    utterance.lang = "es-MX";
    utterance.rate = 1;
    utterance.pitch = 1.2;
    utterance.volume = 1;

    // Configurar qué hacer al terminar de hablar
    utterance.onend = () => {
        console.log("✅ Voz finalizada");
    };

    // Buscar y seleccionar la voz "Microsoft Sabina"
    const seleccionarSabina = () => {
        const voces = speechSynthesis.getVoices();
        const sabina = voces.find(voz =>
            voz.name.includes("Sabina") && voz.lang === "es-MX"
        );
        if (sabina) {
            utterance.voice = sabina;
        } else {
            console.warn("⚠️ No se encontró 'Microsoft Sabina'. Usando voz predeterminada.");
        }
        speechSynthesis.speak(utterance);
    };

    // Si las voces ya están disponibles, usarla
    if (speechSynthesis.getVoices().length > 0) {
        seleccionarSabina();
    } else {
        // Esperar a que se carguen las voces
        speechSynthesis.onvoiceschanged = () => {
            seleccionarSabina();
            speechSynthesis.onvoiceschanged = null; // prevenir duplicados
        };
    }
}


function agregarAlChat(tipo, contenido) {
    const resultado = document.getElementById("resultado");
    if (!resultado) return;

    const msg = document.createElement("div");
    msg.textContent = (tipo === "pregunta" ? "❓ " + contenido : "💬 " + contenido);
    msg.style.margin = "4px 0";
    msg.style.background = tipo === "pregunta" ? "#636363ff" : "white";
    msg.style.color = tipo === "pregunta" ? "#ffffffff" : "black";
    msg.style.padding = "6px";
    msg.style.borderRadius = "6px";
    resultado.appendChild(msg);
    resultado.scrollTop = resultado.scrollHeight;
}

function mostrarResultado(pregunta, respuesta) {
    agregarAlChat("pregunta", pregunta);
    agregarAlChat("respuesta", respuesta);
}

function escuchar() {
    const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    reconocimiento.lang = "es-MX";
    reconocimiento.interimResults = false;
    reconocimiento.maxAlternatives = 1;

    reconocimiento.start();
    mostrarResultado("Escuchando...", "");

    reconocimiento.onresult = function (event) {
        const question = event.results[0][0].transcript;
        const respuesta = responderPregunta(question, data);
        mostrarResultado(question, respuesta);
        hablar(respuesta);
    };

    reconocimiento.onerror = function (event) {
        if (event.error === "network") {
            mostrarResultado("Conexión", "Necesitas conexión a Internet para usar el reconocimiento de voz.");
        } else if (event.error === "not-allowed") {
            mostrarResultado("Permiso denegado", "Debes permitir el uso del micrófono para continuar.");
        } else if (event.error === "no-speech") {
            mostrarResultado("Pregunta algo", "Debes decir algo en el micrófono");
        } else {
            mostrarResultado("Error", event.error);
        }
    };
}

function procesarEntradaManual() {
    const input = document.getElementById("entrada");
    const question = input.value.trim();
    if (!question || !data) return;
    input.value = "";
    const respuesta = responderPregunta(question, data);
    mostrarResultado(question, respuesta);
    hablar(respuesta);
}

window.addEventListener("DOMContentLoaded", () => {
    const modelos = document.querySelectorAll(".interactivo");
    modelos.forEach(modelo => {
        modelo.addEventListener("click", () => {
            const nombre = modelo.getAttribute("data-nombre");
            mostrarInformacionObraAFrame(nombre);
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const btnCerrarHUD = document.querySelector("#cerrar-hud-btn");
    if (btnCerrarHUD) {
        btnCerrarHUD.addEventListener("click", () => {
            const panel = document.querySelector("#info-panel");
            panel.setAttribute("visible", false);
        });
    }
});



window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("hablarBtn").addEventListener("click", () => {
        if (!data) {
            mostrarResultado("Cargando datos...", "Espera un momento.");
            return;
        }
        escuchar();
    });
    document.getElementById("enviarBtn").addEventListener("click", procesarEntradaManual);
    document.getElementById("entrada").addEventListener("keydown", e => {
        if (e.key === "Enter") procesarEntradaManual();
    });

    const iniciarBtn = document.getElementById("iniciarBtn");
    if (iniciarBtn) {
        iniciarBtn.addEventListener("click", () => {
            const container = document.getElementById("bienvenida-container");
            if (container) container.style.display = "none";

            if (data && data.mensajes_sistema && data.mensajes_sistema.bienvenida) {
                const bienvenida = data.mensajes_sistema.bienvenida;
                const nombreIa = "Xamani";
                const mensaje = "¡Hola! Soy " + nombreIa + " tu guía del México Prehispánico. " + bienvenida[Math.floor(Math.random() * bienvenida.length)];
                mostrarResultado(nombreIa, mensaje)
                hablar(mensaje);
            }
        });
    } else {
        console.error("❌ No se encontró el botón #iniciarBtn");
    }

    const btnTrivia = document.getElementById("btnTrivia");
    if (btnTrivia) {
        btnTrivia.addEventListener("click", iniciarTrivia);
    }

    const btnVerificar = document.getElementById("verificarTrivia");
    if (btnVerificar) {
        btnVerificar.addEventListener("click", verificarTrivia);
    }

    document.getElementById("iniciarBtn").addEventListener("click", () => {
        document.getElementById("chat-container").style.display = "block";
        document.getElementById("abrirChat").style.display = "none";
    });

    document.getElementById("minimizarChat").addEventListener("click", () => {
        document.getElementById("chat-container").style.display = "none";
        document.getElementById("abrirChat").style.display = "block";
    });

    document.getElementById("abrirChat").addEventListener("click", () => {
        document.getElementById("chat-container").style.display = "block";
        document.getElementById("abrirChat").style.display = "none";
    });


});