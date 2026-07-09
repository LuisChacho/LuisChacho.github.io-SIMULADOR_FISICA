document.addEventListener("DOMContentLoaded", () => {
    const GRAVITY = 9.8;
    const CATEGORIES = [
        "Vectores", "MRU", "MRUV", "Caída Libre", "Tiro Vertical", 
        "Movimiento Parabólico", "MCU", "MCUV", "Leyes de Newton", "Trabajo y Energía"
    ];

    let questionsBank = [];
    let examState = {
        currentQuestionId: null,
        userAnswers: {},
        lifelinesUsed: { "5050": false, "discard": false, "hint": false, "stats": false }
    };

    function initQuestionsGenerator() {
        for (let i = 1; i <= 100; i++) {
            let catIndex = (i - 1) % CATEGORIES.length;
            let category = CATEGORIES[catIndex];
            
            let data = { id: i, category: category, text: "", correctAnswer: 0, options: [], justification: "", hint: "" };
            let factor_a = (i * 7) % 19 + 4;
            let factor_b = (i * 4) % 11 + 2;

            switch (category) {
                case "Vectores":
                    let ax = factor_a, ay = factor_b;
                    let mag = Math.sqrt(ax*ax + ay*ay);
                    data.text = `Un vector de fuerza en el plano cartesiano tiene componentes analíticas Fx = ${ax} N y Fy = ${ay} N. Calcule el módulo o magnitud del vector resultante.`;
                    data.correctAnswer = mag;
                    data.options = [mag, mag + 3.15, mag * 0.65, Math.sqrt(ax+ay)];
                    data.justification = `Por teorema de Pitágoras: |F| = √(Fx² + Fy²) = √(${ax}² + ${ay}²) = √(${ax*ax + ay*ay}) = ${mag.toFixed(2)} N.`;
                    data.hint = "Recuerde aplicar el teorema de Pitágoras utilizando las componentes ortogonales del vector.";
                    break;
                case "MRU":
                    let vel = factor_a;
                    let time = factor_b + 3;
                    let dist = vel * time;
                    data.text = `Un móvil universitario se desplaza en línea recta con velocidad constante a razón de ${vel} m/s. ¿Cuánto tiempo en segundos le tomará recorrer una distancia total de ${dist} metros?`;
                    data.correctAnswer = time;
                    data.options = [time, time + 2.5, time * 1.4, dist * vel];
                    data.justification = `En el movimiento rectilíneo uniforme (MRU), el tiempo se despeja directamente como t = d / v. Sustituyendo: ${dist} / ${vel} = ${time.toFixed(2)} s.`;
                    data.hint = "La relación es lineal directa. La velocidad es el cociente de la distancia sobre el tiempo transcurrido.";
                    break;
                case "MRUV":
                    let v0 = factor_b;
                    let accel = ((factor_a % 4) + 1);
                    let t_mruv = 6;
                    let vf = v0 + (accel * t_mruv);
                    data.text = `Un cuerpo acelera uniformemente a razón de ${accel} m/s² partiendo con una velocidad inicial de ${v0} m/s. Determine su velocidad final trascurridos ${t_mruv} segundos.`;
                    data.correctAnswer = vf;
                    data.options = [vf, vf + 4.1, vf * 0.75, v0 * accel * t_mruv];
                    data.justification = `Aplicando la ecuación cinemática fundamental de velocidad final: Vf = V0 + a * t. Sustituyendo valores: ${v0} + (${accel} * ${t_mruv}) = ${vf.toFixed(2)} m/s.`;
                    data.hint = "La velocidad aumenta de manera uniforme proporcional a la aceleración por cada segundo transcurrido.";
                    break;
                case "Caída Libre":
                    let t_caida = (factor_b % 4) + 2;
                    let h_caida = 0.5 * GRAVITY * t_caida * t_caida;
                    data.text = `Se suelta una partícula desde el reposo absoluto en el vacío. Despreciando la fricción del aire, determine la altura en metros requerida para que tarde exactamente ${t_caida} segundos en impactar contra el suelo (g = ${GRAVITY} m/s²).`;
                    data.correctAnswer = h_caida;
                    data.options = [h_caida, h_caida + 15.2, h_caida * 0.5, GRAVITY * t_caida];
                    data.justification = `A partir de h = (1/2)*g*t², sustituimos directamente el tiempo: 0.5 * ${GRAVITY} * (${t_caida}²) = ${h_caida.toFixed(2)} m.`;
                    data.hint = "Al partir del reposo, la velocidad inicial es cero. Use el despeje directo del tiempo en función de la raíz cuadrada.";
                    break;
                case "Tiro Vertical":
                    let v_lanzamiento = factor_a + 12;
                    let h_max = (v_lanzamiento * v_lanzamiento) / (2 * GRAVITY);
                    data.text = `Un proyectil es lanzado verticalmente hacia arriba desde el nivel del suelo con una velocidad inicial de ${v_lanzamiento} m/s. Determine la altura máxima alcanzada antes de detenerse (g = ${GRAVITY} m/s²).`;
                    data.correctAnswer = h_max;
                    data.options = [h_max, h_max + 8.4, h_max * 0.8, v_lanzamiento / GRAVITY];
                    data.justification = `En el punto de altura máxima la velocidad final es cero. Por tanto, Hmax = V0² / (2g). Sustituyendo: (${v_lanzamiento}²) / (2 * ${GRAVITY}) = ${h_max.toFixed(2)} m.`;
                    data.hint = "Considere que toda la energía cinética inicial se transforma por completo en energía potencial gravitatoria al detenerse arriba.";
                    break;
                case "Movimiento Parabólico":
                    let v_parab = factor_a + 15;
                    let alcance = (v_parab * v_parab * Math.sin(2 * 45 * Math.PI / 180)) / GRAVITY;
                    data.text = `Un cañón de pruebas dispara un proyectil con una velocidad de ${v_parab} m/s con un ángulo de elevación óptimo de 45° respecto a la horizontal. Calcule su alcance horizontal máximo (g = ${GRAVITY} m/s²).`;
                    data.correctAnswer = alcance;
                    data.options = [alcance, alcance + 30.5, alcance * 0.7, v_parab * 2];
                    data.justification = `El alcance horizontal máximo se calcula mediante R = (V0² * sin(2θ)) / g. Con θ = 45°, sin(90°) = 1. Así, R = ${v_parab}² / ${GRAVITY} = ${alcance.toFixed(2)} m.`;
                    data.hint = "El ángulo de 45 grados maximiza la componente horizontal de alcance útil al equilibrar el tiempo de vuelo y velocidad en X.";
                    break;
                case "MCU":
                    let radio_mcu = factor_b;
                    let periodo = factor_a / 3;
                    let v_tangencial = (2 * Math.PI * radio_mcu) / periodo;
                    data.text = `Un objeto describe un movimiento circular uniforme en una pista con un radio R = ${radio_mcu} m. Si tarda un periodo T = ${periodo.toFixed(2)} s en dar una revolución completa, calcule su velocidad tangencial lineal.`;
                    data.correctAnswer = v_tangencial;
                    data.options = [v_tangencial, v_tangencial + 3.4, v_tangencial * 0.6, radio_mcu / periodo];
                    data.justification = `La velocidad tangencial se define como la longitud de la circunferencia recorrida dividida entre el periodo orbital: Vt = (2 * π * R) / T. Resultado: ${v_tangencial.toFixed(2)} m/s.`;
                    data.hint = "Piense en calcular el perímetro total de la circunferencia y dividirlo entre el tiempo que requiere dar una sola vuelta.";
                    break;
                case "MCUV":
                    let w0 = 0;
                    let alpha = factor_b * 0.4;
                    let t_mcuv = 5;
                    let w_final = w0 + (alpha * t_mcuv);
                    data.text = `Un disco de inercia parte del reposo con una aceleración angular constante de ${alpha.toFixed(2)} rad/s². Determine el módulo de su velocidad angular final al cabo de ${t_mcuv} segundos de rotación.`;
                    data.correctAnswer = w_final;
                    data.options = [w_final, w_final + 2.2, w_final * 0.5, alpha * t_mcuv * t_mcuv];
                    data.justification = `Análogo al movimiento lineal, la velocidad angular final se calcula mediante la fórmula: wf = w0 + α * t. Reemplazando datos: 0 + (${alpha.toFixed(2)} * ${t_mcuv}) = ${w_final.toFixed(2)} rad/s.`;
                    data.hint = "La aceleración angular representa el cambio neto de la tasa de rotación por cada unidad de tiempo.";
                    break;
                case "Leyes de Newton":
                    let masa = factor_a * 1.5;
                    let fuerza_n = factor_a * factor_b * 3;
                    let acc_newton = fuerza_n / masa;
                    data.text = `Un bloque de masa m = ${masa.toFixed(2)} kg se encuentra sobre una superficie horizontal completamente lisa. Si se le aplica una fuerza neta constante de ${fuerza_n.toFixed(2)} N, ¿qué aceleración experimentará?`;
                    data.correctAnswer = acc_newton;
                    data.options = [acc_newton, acc_newton + 1.8, acc_newton * 0.5, fuerza_n * masa];
                    data.justification = `De acuerdo con la Segunda Ley de Newton, la aceleración es directamente proporcional a la fuerza e inversamente proporcional a la masa: a = F / m = ${fuerza_n.toFixed(2)} / ${masa.toFixed(2)} = ${acc_newton.toFixed(2)} m/s².`;
                    data.hint = "Aisla la aceleración de la clásica fórmula dinámica del movimiento lineal.";
                    break;
                case "Trabajo y Energía":
                    let m_energia = factor_b * 2;
                    let h_energia = factor_a;
                    let e_pot = m_energia * GRAVITY * h_energia;
                    data.text = `Determine la energía potencial gravitatoria acumulada de un cuerpo de masa m = ${m_energia} kg que se encuentra suspendido estáticamente a una altura de ${h_energia} metros respecto al suelo (g = ${GRAVITY} m/s²).`;
                    data.correctAnswer = e_pot;
                    data.options = [e_pot, e_pot + 220, e_pot * 0.75, m_energia * h_energia];
                    data.justification = `La energía potencial gravitatoria se calcula mediante el producto de la masa, la aceleración de la gravedad y la altura respecto al origen: Ep = m * g * h. Operando: ${m_energia} * ${GRAVITY} * ${h_energia} = ${e_pot.toFixed(2)} Joules.`;
                    data.hint = "El trabajo realizado en contra del campo gravitatorio almacena energía puramente escalar en función de su altura.";
                    break;
            }

            data.options = data.options.map((val, idx) => {
                return { text: `${val.toFixed(2)} ${getUnit(data.category)}`, isCorrect: idx === 0, originalIndex: idx };
            });
            questionsBank.push(data);
        }
    }

    function getUnit(category) {
        switch (category) {
            case "Vectores": return "N";
            case "MRU": case "Caída Libre": return "s";
            case "MRUV": case "Movimiento Parabólico": return "m/s";
            case "Tiro Vertical": case "Trabajo y Energía": return category === "Tiro Vertical" ? "m" : "J";
            case "MCU": return "m/s";
            case "MCUV": return "rad/s";
            case "Leyes de Newton": return "m/s²";
            default: return "";
        }
    }

    function shuffleArray(array) {
        let shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    const matrixContainer = document.getElementById("questions-matrix");
    const qCategory = document.getElementById("question-category");
    const qId = document.getElementById("question-id");
    const qText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const feedbackPanel = document.getElementById("feedback-panel");
    const feedbackText = document.getElementById("feedback-text");
    
    const txtAnswered = document.getElementById("txt-answered");
    const txtCorrect = document.getElementById("txt-correct");
    const txtIncorrect = document.getElementById("txt-incorrect");

    const btn5050 = document.getElementById("btn-5050");
    const btnDiscard = document.getElementById("btn-discard");
    const btnHint = document.getElementById("btn-hint");
    const btnStats = document.getElementById("btn-stats");
    const lifelineFeedback = document.getElementById("lifeline-feedback");

    function renderMatrix() {
        matrixContainer.innerHTML = "";
        questionsBank.forEach((q) => {
            const cell = document.createElement("button");
            cell.className = "cell-nav status-pending";
            cell.textContent = q.id;
            cell.id = `cell-${q.id}`;
            cell.addEventListener("click", () => loadQuestion(q.id));
            matrixContainer.appendChild(cell);
        });
    }

    function loadQuestion(id) {
        examState.currentQuestionId = id;
        const question = questionsBank.find(q => q.id === id);

        document.querySelectorAll(".cell-nav").forEach(c => c.classList.remove("active"));
        document.getElementById(`cell-${id}`).classList.add("active");

        qCategory.textContent = question.category;
        qId.textContent = `Reactivo #${question.id}`;
        qText.textContent = question.text;

        optionsContainer.innerHTML = "";
        lifelineFeedback.classList.add("hidden");

        const history = examState.userAnswers[id];
        let optionsToRender = [];

        if (history) {
            optionsToRender = history.optionsMapping;
        } else {
            optionsToRender = shuffleArray(question.options);
            examState.userAnswers[id] = { answered: false, selectedIndex: null, correct: false, optionsMapping: optionsToRender };
        }

        optionsToRender.forEach((opt, index) => {
            const btn = document.createElement("button");
            btn.className = "btn-option";
            btn.textContent = opt.text;
            btn.addEventListener("click", () => submitAnswer(index));
            optionsContainer.appendChild(btn);
        });

        if (examState.userAnswers[id].answered) {
            lockOptionsAndShowFeedback(id);
            toggleLifelinesState(true);
        } else {
            feedbackPanel.classList.add("hidden");
            toggleLifelinesState(false);
        }
    }

    function submitAnswer(selectedIndex) {
        const id = examState.currentQuestionId;
        const state = examState.userAnswers[id];
        if (state.answered) return;

        state.answered = true;
        state.selectedIndex = selectedIndex;
        state.correct = state.optionsMapping[selectedIndex].isCorrect;

        updateGlobalCounters();
        const cell = document.getElementById(`cell-${id}`);
        cell.classList.remove("status-pending");
        cell.classList.add(state.correct ? "status-correct" : "status-incorrect");

        lockOptionsAndShowFeedback(id);
        toggleLifelinesState(true);
    }

    function lockOptionsAndShowFeedback(id) {
        const state = examState.userAnswers[id];
        const question = questionsBank.find(q => q.id === id);
        const optionButtons = optionsContainer.querySelectorAll(".btn-option");

        optionButtons.forEach((btn, index) => {
            btn.disabled = true;
            if (state.optionsMapping[index].isCorrect) btn.classList.add("correct-choice");
            if (index === state.selectedIndex && !state.optionsMapping[index].isCorrect) btn.classList.add("incorrect-choice");
        });

        feedbackText.textContent = question.justification;
        feedbackPanel.classList.remove("hidden");
    }

    function updateGlobalCounters() {
        let total = 0, correct = 0, incorrect = 0;
        for (let key in examState.userAnswers) {
            if (examState.userAnswers[key].answered) {
                total++;
                if (examState.userAnswers[key].correct) correct++;
                else incorrect++;
            }
        }
        txtAnswered.textContent = `${total}/100`;
        txtCorrect.textContent = correct;
        txtIncorrect.textContent = incorrect;
    }

    function toggleLifelinesState(shouldDisableAll) {
        btn5050.disabled = shouldDisableAll || examState.lifelinesUsed["5050"];
        btnDiscard.disabled = shouldDisableAll || examState.lifelinesUsed["discard"];
        btnHint.disabled = shouldDisableAll || examState.lifelinesUsed["hint"];
        btnStats.disabled = shouldDisableAll || examState.lifelinesUsed["stats"];
    }

    btn5050.addEventListener("click", () => {
        if (!examState.currentQuestionId || examState.lifelinesUsed["5050"]) return;
        const state = examState.userAnswers[examState.currentQuestionId];
        const optionButtons = optionsContainer.querySelectorAll(".btn-option");
        let count = 0;
        optionButtons.forEach((btn, index) => {
            if (!state.optionsMapping[index].isCorrect && count < 2) {
                btn.classList.add("hidden-option");
                btn.disabled = true;
                count++;
            }
        });
        examState.lifelinesUsed["5050"] = true; btn5050.disabled = true;
    });

    btnDiscard.addEventListener("click", () => {
        if (!examState.currentQuestionId || examState.lifelinesUsed["discard"]) return;
        const state = examState.userAnswers[examState.currentQuestionId];
        const optionButtons = optionsContainer.querySelectorAll(".btn-option");
        let incorrects = [];
        state.optionsMapping.forEach((opt, idx) => { if (!opt.isCorrect) incorrects.push(idx); });
        let randomIdx = incorrects[Math.floor(Math.random() * incorrects.length)];
        optionButtons[randomIdx].classList.add("hidden-option");
        optionButtons[randomIdx].disabled = true;
        examState.lifelinesUsed["discard"] = true; btnDiscard.disabled = true;
    });

    btnHint.addEventListener("click", () => {
        if (!examState.currentQuestionId || examState.lifelinesUsed["hint"]) return;
        const question = questionsBank.find(q => q.id === examState.currentQuestionId);
        lifelineFeedback.textContent = `💡 Sugerencia: ${question.hint}`;
        lifelineFeedback.classList.remove("hidden");
        examState.lifelinesUsed["hint"] = true; btnHint.disabled = true;
    });

    btnStats.addEventListener("click", () => {
        if (!examState.currentQuestionId || examState.lifelinesUsed["stats"]) return;
        const state = examState.userAnswers[examState.currentQuestionId];
        let letter = "A";
        state.optionsMapping.forEach((opt, idx) => { if (opt.isCorrect) letter = String.fromCharCode(65 + idx); });
        let percentage = Math.floor(Math.random() * 17) + 75;
        lifelineFeedback.textContent = `📊 Estadística: El ${percentage}% de los alumnos coincide en que la opción correcta es la (${letter}).`;
        lifelineFeedback.classList.remove("hidden");
        examState.lifelinesUsed["stats"] = true; btnStats.disabled = true;
    });

    initQuestionsGenerator();
    renderMatrix();
    loadQuestion(1);
});