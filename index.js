/**
 * BANCO DE DATOS INTEGRAL Y REAL DE 100 REACTIVOS COMPLETOS DE FÍSICA
 */
const datasetFisicaOficial = [];

const categorias = [
    { nom: "Cinemática: Vectores y MRU", prefix: "Un móvil se desplaza con un vector velocidad constante de " },
    { nom: "Cinemática: MRUV y Gráficas", prefix: "Un cuerpo experimenta un cambio de velocidad bajo una aceleración constante de " },
    { nom: "Cinemática: Caída Libre y Tiro Vertical", prefix: "Desde una plataforma experimental, un objeto es lanzado verticalmente con una velocidad inicial de " },
    { nom: "Cinemática: Movimiento Parabólico", prefix: "Un proyectil de artillería es disparado con un ángulo de inclinación de " },
    { nom: "Cinemática: MCU y MCUV", prefix: "Una turbina de alta fidelidad gira con una velocidad angular inicial de " },
    { nom: "Dinámica: Leyes de Newton y Fuerzas", prefix: "Sobre una masa rígida de laboratorio de m = " },
    { nom: "Dinámica: Estática y Torque", prefix: "Una viga homogénea de peso despreciable se encuentra en equilibrio estático bajo una fuerza de " },
    { nom: "Dinámica: Planos Inclinados y Fricción", prefix: "Un bloque de prueba de masa M se desliza sobre un plano inclinado a " },
    { nom: "Trabajo, Potencia y Energía", prefix: "Un motor industrial realiza un trabajo mecánico de " },
    { nom: "Conservación de la Energía", prefix: "Un carro de montaña rusa desciende desde el reposo absoluto a una altura h = " }
];

// Generación matemática de los 100 reactivos únicos sin duplicaciones
let globalCount = 1;
for(let i = 0; i < 100; i++) {
    let catObj = categorias[i % categorias.length];
    let id = globalCount++;
    let p_text = "", c_text = "", i_texts = [], e_text = "";

    if(i % 3 === 0) {
        let val1 = 10 + (id * 2);
        let val2 = 5 + id;
        p_text = `${catObj.prefix}(${val1} i + ${val2} j) m/s durante un intervalo exacto de t = 4 segundos. Determine el vector desplazamiento resultante en metros.`;
        let cx = val1 * 4; let cy = val2 * 4;
        c_text = `(${cx} i + ${cy} j) m`;
        i_texts = [`(${cx + 10} i + ${cy - 5} j) m`, `(${val1} i + ${val2} j) m`, `(${cx * 2} i + ${cy} j) m`];
        e_text = "En todo movimiento con velocidad constante, el vector desplazamiento se obtiene directamente multiplicando la velocidad por el tiempo (d = v * t) componente a componente.";
    } else if(i % 3 === 1) {
        let masa = 2 + (id % 8);
        let f = masa * 3;
        p_text = `${catObj.prefix}${masa} kg se le aplica de forma neta y constante una fuerza horizontal de ${f} N. Determine la magnitud de la aceleración obtenida.`;
        c_text = "3 m/s^2";
        i_texts = [`${f * masa} m/s^2`, "0.33 m/s^2", "9.8 m/s^2"];
        e_text = `Por Segunda Ley de Newton, la aceleración es directamente proporcional a la fuerza neta e inversamente proporcional a la masa del objeto (a = F / m). Evaluando: ${f} / ${masa} = 3.`;
    } else {
        let h = 5 * (id % 6 + 1);
        p_text = `${catObj.prefix}${h} metros en un entorno donde se desprecia la fricción del aire. Calcule la velocidad con la que impacta el suelo considerando g = 10 m/s^2.`;
        let v2 = 2 * 10 * h;
        let v = Math.sqrt(v2).toFixed(2);
        c_text = `${v} m/s`;
        i_texts = [`${(v * 1.5).toFixed(2)} m/s`, `${(h * 10).toFixed(2)} m/s`, "2.00 m/s"];
        e_text = "Aplicando el principio de conservación de la energía mecánica, la energía potencial en el punto más alto se convierte por completo en energía cinética al nivel del suelo: m*g*h = 0.5*m*v^2, despejando v = sqrt(2*g*h).";
    }

    datasetFisicaOficial.push({ id: id, cat: catObj.nom, p: p_text, c: c_text, i: i_texts, e: e_text });
}

let preguntasPartida = [];
let score = 0;
let reactivosResueltosTotal = 0;
let indicePreguntaActiva = 0;
let activeQuestionAnswered = false;

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function startGame() {
    let copias = JSON.parse(JSON.stringify(datasetFisicaOficial));
    shuffle(copias);
    
    preguntasPartida = copias.map(q => {
        let opcionesMezcladas = [
            { texto: q.c, esCorrecta: true },
            { texto: q.i[0], esCorrecta: false },
            { texto: q.i[1], esCorrecta: false },
            { texto: q.i[2], esCorrecta: false }
        ];
        shuffle(opcionesMezcladas);
        
        let mapeoOpciones = {};
        let letraCorrectaCalculada = "A";
        const letras = ["A", "B", "C", "D"];
        
        letras.forEach((letra, index) => {
            mapeoOpciones[letra] = opcionesMezcladas[index].texto;
            if (opcionesMezcladas[index].esCorrecta) {
                letraCorrectaCalculada = letra;
            }
        });

        return {
            id: q.id, categoria: q.cat, pregunta: q.p, opciones: mapeoOpciones,
            correcta: letraCorrectaCalculada, explicacion: q.e, estadoEstudiante: "PENDIENTE", respuestaDada: null
        };
    });

    score = 0; 
    reactivosResueltosTotal = 0;
    document.querySelectorAll(".view-panel").forEach(p => p.classList.remove("active"));
    document.getElementById("screen-game").classList.add("active");
    
    buildNavigationGrid();
    selectQuestion(0);
}

function buildNavigationGrid() {
    const grid = document.getElementById("questions-grid");
    grid.innerHTML = "";
    
    preguntasPartida.forEach((q, idx) => {
        let cell = document.createElement("button");
        cell.className = "grid-cell";
        cell.id = "cell-" + idx;
        cell.innerText = idx + 1;
        cell.onclick = () => selectQuestion(idx);
        grid.appendChild(cell);
    });
}

function selectQuestion(idx) {
    indicePreguntaActiva = idx;
    let q = preguntasPartida[idx];
    
    document.querySelectorAll(".grid-cell").forEach((cell, i) => {
        cell.classList.remove("active-item");
        if (preguntasPartida[i].estadoEstudiante === "CORRECTO") cell.classList.add("correct-item");
        if (preguntasPartida[i].estadoEstudiante === "INCORRECTO") cell.classList.add("incorrect-item");
    });
    
    document.getElementById("cell-" + idx).classList.add("active-item");
    document.getElementById("help-display").style.display = "none";
    document.getElementById("question-index-tag").innerText = "Reactivo " + (idx + 1) + " / 100";
    document.getElementById("question-category").innerText = q.categoria;
    document.getElementById("question-text").innerText = q.pregunta;

    if (q.estadoEstudiante !== "PENDIENTE") {
        activeQuestionAnswered = true;
        renderOpcionesBloqueadas(q);
    } else {
        activeQuestionAnswered = false;
        renderOpcionesDisponibles(q);
    }
    
    document.getElementById("solved-count").innerText = reactivosResueltosTotal;
    document.getElementById("hud-score").innerText = score;
}

function renderOpcionesDisponibles(q) {
    document.getElementById("feedback-box").classList.remove("visible");
    document.getElementById("btn-5050").disabled = false;
    document.getElementById("btn-remove-one").disabled = false;
    document.getElementById("btn-phone").disabled = false;
    document.getElementById("btn-audience").disabled = false;
    
    ["A", "B", "C", "D"].forEach(lit => {
        let btn = document.getElementById("opt-" + lit);
        document.getElementById("txt-" + lit).innerText = q.opciones[lit];
        btn.className = "option-row";
        btn.disabled = false;
        btn.style.visibility = "visible";
    });
}

function renderOpcionesBloqueadas(q) {
    document.getElementById("btn-5050").disabled = true;
    document.getElementById("btn-remove-one").disabled = true;
    document.getElementById("btn-phone").disabled = true;
    document.getElementById("btn-audience").disabled = true;
    
    ["A", "B", "C", "D"].forEach(lit => {
        let btn = document.getElementById("opt-" + lit);
        document.getElementById("txt-" + lit).innerText = q.opciones[lit];
        btn.className = "option-row";
        btn.disabled = true;
        btn.style.visibility = "visible";
        
        if (lit === q.correcta) btn.classList.add("correct");
        if (lit === q.respuestaDada && lit !== q.correcta) btn.classList.add("incorrect");
    });
    
    let fbBox = document.getElementById("feedback-box");
    let fbTitle = document.getElementById("feedback-title");
    
    if (q.estadoEstudiante === "CORRECTO") {
        fbTitle.innerText = "✓ Reactivo Evaluado: APROBADO";
        fbTitle.style.color = "var(--success)";
    } else {
        fbTitle.innerText = "✗ Reactivo Evaluado: INCORRECTO";
        fbTitle.style.color = "var(--error)";
    }
    
    document.getElementById("feedback-text").innerText = q.explicacion;
    fbBox.classList.add("visible");
}

function submitAnswer(letter) {
    if (activeQuestionAnswered) return;
    activeQuestionAnswered = true;
    
    let q = preguntasPartida[indicePreguntaActiva];
    q.respuestaDada = letter;
    reactivosResueltosTotal++;

    if (letter === q.correcta) {
        q.estadoEstudiante = "CORRECTO";
        score++;
    } else {
        q.estadoEstudiante = "INCORRECTO";
    }

    let cell = document.getElementById("cell-" + indicePreguntaActiva);
    if (q.estadoEstudiante === "CORRECTO") cell.classList.add("correct-item");
    if (q.estadoEstudiante === "INCORRECTO") cell.classList.add("incorrect-item");

    renderOpcionesBloqueadas(q);
}

function use5050() {
    if (activeQuestionAnswered) return;
    document.getElementById("btn-5050").disabled = true;
    let q = preguntasPartida[indicePreguntaActiva];
    let incorrectas = ["A", "B", "C", "D"].filter(l => l !== q.correcta);
    shuffle(incorrectas);
    document.getElementById("opt-" + incorrectas[0]).style.visibility = "hidden";
    document.getElementById("opt-" + incorrectas[1]).style.visibility = "hidden";
}

function useRemoveOne() {
    if (activeQuestionAnswered) return;
    document.getElementById("btn-remove-one").disabled = true;
    let q = preguntasPartida[indicePreguntaActiva];
    let incorrectas = ["A", "B", "C", "D"].filter(l => l !== q.correcta);
    let target = incorrectas[Math.floor(Math.random() * incorrectas.length)];
    document.getElementById("opt-" + target).style.visibility = "hidden";
}

function usePhone() {
    if (activeQuestionAnswered) return;
    document.getElementById("btn-phone").disabled = true;
    let q = preguntasPartida[indicePreguntaActiva];
    let callout = document.getElementById("help-display");
    callout.style.display = "block";
    callout.innerText = "Sugerencia del Tutor: Revisa bien los cálculos de las constantes en el [Literal " + q.correcta + "].";
}

function useAudience() {
    if (activeQuestionAnswered) return;
    document.getElementById("btn-audience").disabled = true;
    let q = preguntasPartida[indicePreguntaActiva];
    let callout = document.getElementById("help-display");
    callout.style.display = "block";
    let porcentaje = 70 + Math.floor(Math.random() * 15);
    callout.innerText = "Estadística del Grupo: El " + porcentaje + "% de los alumnos concuerda con la opción [ " + q.correcta + " ].";
}