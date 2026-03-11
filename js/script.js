document.addEventListener('DOMContentLoaded', () => {
    // =============================
    // VARIABLES DE ESTADO DEL JUEGO
    // =============================
    let magicNumber;          // Número aleatorio secreto
    let attempts;             // Contador actual de intentos
    let maxAttempts = 10;     // Máximo de intentos permitidos
    let maxRange = 100;       // Rango máximo del número
    let history = [];         // Arreglo para guardar los números y prevenir repetidos
    let timerInterval;        // Referencia al temporizador
    let timerSeconds = 0;     // Segundos restantes

    const difficultyConfig = {
        easy: { maxRange: 50, maxAttempts: 10, timeLimit: 0 },
        medium: { maxRange: 100, maxAttempts: 7, timeLimit: 0 },
        hard: { maxRange: 500, maxAttempts: 10, timeLimit: 60 }
    };

    // =========================================================
    // REFERENCIAS AL DOM (Elementos de HTML que se manipularán)
    // =========================================================
    const elements = {
        attemptsLeft: document.getElementById('attempts-left'),
        guessInput: document.getElementById('guess-input'),
        guessButton: document.getElementById('guess-button'),
        messageContainer: document.getElementById('message-container'),
        gameMessage: document.getElementById('game-message'),
        restartButton: document.getElementById('restart-button'),
        historySection: document.getElementById('history-section'),
        historyList: document.getElementById('history-list'),
        inputSection: document.getElementById('input-section'),
        actionSection: document.getElementById('action-section'),
        themeToggle: document.getElementById('theme-toggle'),
        gameCard: document.querySelector('.game-card'),
        difficultySelect: document.getElementById('difficulty-select'),
        timerPill: document.getElementById('timer-pill'),
        timeLeftSpan: document.getElementById('time-left'),
        rangeText: document.getElementById('range-text'),
        welcomeModal: document.getElementById('welcome-modal'),
        startGameBtn: document.getElementById('start-game-btn'),
        mainGame: document.getElementById('main-game'),
        extraActions: document.getElementById('extra-actions'),
        hintButton: document.getElementById('hint-button'),
        giveupButton: document.getElementById('giveup-button'),
        menuToggle: document.getElementById('menu-toggle')
    };

    // =======================
    // MODO OSCURO (Dark Mode)
    // =======================
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        elements.themeToggle.textContent = '☀️';
    }

    elements.themeToggle.addEventListener('click', () => {
        initAudio();
        playClickSound();
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            elements.themeToggle.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            elements.themeToggle.textContent = '☀️';
        }
    });

    // =============================
    // EFECTOS DE SONIDO Y ANIMACIÓN
    // =============================
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playTone(freq, type, duration, vol = 0.1) {
        if (!audioCtx) return;
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    }

    function playWinSound() {
        initAudio();
        playTone(400, 'sine', 0.2);
        setTimeout(() => playTone(523.25, 'sine', 0.2), 150);
        setTimeout(() => playTone(659.25, 'sine', 0.2), 300);
        setTimeout(() => playTone(783.99, 'sine', 0.4), 450);
    }

    function playLoseSound() {
        initAudio();
        playTone(300, 'triangle', 0.3);
        setTimeout(() => playTone(250, 'triangle', 0.3), 200);
        setTimeout(() => playTone(200, 'triangle', 0.5), 400);
    }

    function playErrorSound() {
        initAudio();
        playTone(200, 'sawtooth', 0.15, 0.05);
        setTimeout(() => playTone(150, 'sawtooth', 0.2, 0.05), 120);
    }

    function playClickSound() {
        if (audioCtx && audioCtx.state !== 'suspended') {
            playTone(600, 'sine', 0.1, 0.02);
        }
    }

    function playPopSound() {
        if (audioCtx && audioCtx.state !== 'suspended') {
            playTone(400, 'sine', 0.1, 0.03);
        }
    }

    function triggerError(msg) {
        showMessage(msg, 'msg-warning');
        playErrorSound();
        elements.gameCard.classList.remove('error-shake');
        void elements.gameCard.offsetWidth; // Force Reflow
        elements.gameCard.classList.add('error-shake');
    }

    // =========================================
    // FUNCIÓN AUXILIAR: Manejo del Temporizador
    // =========================================
    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timerSeconds--;
            elements.timeLeftSpan.textContent = timerSeconds;

            if (timerSeconds <= 10) {
                elements.timeLeftSpan.style.color = 'white';
                elements.timeLeftSpan.style.background = 'var(--danger)';
            }

            if (timerSeconds <= 0) {
                clearInterval(timerInterval);
                endGame(false, null, true);
            }
        }, 1000);
    }

    // ===========================================
    // FUNCIÓN: INICIALIZAR EL JUEGO (O REINICIAR)
    // ===========================================
    function initGame() {
        const diffKey = elements.difficultySelect.value;
        const conf = difficultyConfig[diffKey];
        maxRange = conf.maxRange;
        maxAttempts = conf.maxAttempts;

        // 1. Generar número mágico
        magicNumber = Math.floor(Math.random() * maxRange) + 1;
        attempts = 0;
        history = [];

        elements.rangeText.innerHTML = `He pensado un número del <strong>1 al ${maxRange}</strong>. ¿Puedes adivinarlo?`;

        // 2. Reiniciar interfaz (Pill de intentos y colores)
        elements.attemptsLeft.textContent = maxAttempts;
        elements.attemptsLeft.style.color = 'var(--primary)';
        elements.attemptsLeft.style.background = 'var(--icon-bg)';

        // 3. Reiniciar Temporizador UI
        clearInterval(timerInterval);
        if (conf.timeLimit > 0) {
            elements.timerPill.classList.remove('hidden');
            timerSeconds = conf.timeLimit;
            elements.timeLeftSpan.textContent = timerSeconds;
            elements.timeLeftSpan.style.color = 'var(--primary)';
            elements.timeLeftSpan.style.background = 'var(--icon-bg)';
        } else {
            elements.timerPill.classList.add('hidden');
        }

        // 4. Reactivar inputs
        elements.guessInput.value = '';
        elements.guessInput.disabled = false;
        elements.guessButton.disabled = false;
        elements.guessInput.max = maxRange;
        elements.guessInput.placeholder = `1 - ${maxRange}`;

        // 5. Ocultar mensajes e historial viejo
        elements.messageContainer.classList.add('hidden');
        elements.gameMessage.className = '';
        elements.historySection.classList.add('hidden');
        elements.historyList.innerHTML = '';

        // 6. Ocultar botón "Reiniciar" y mostrar botón "Adivinar"
        elements.actionSection.classList.add('hidden');
        elements.inputSection.classList.remove('hidden');
        elements.extraActions.classList.add('hidden');
        elements.hintButton.classList.add('hidden');

        // Enfocar el input para escribir de inmediato
        elements.guessInput.focus();

        // Log solo para pruebas o desarrollo oculto
        // console.log("Número mágico:", magicNumber);
    }

    // ========================================
    // FUNCIÓN: GESTIONAR LA LÓGICA DE Adivinar
    // ========================================
    function handleGuess() {
        initAudio();

        const guessValue = elements.guessInput.value;

        // Válidación 1: Estar vacío o no ser número
        if (!guessValue || isNaN(guessValue)) {
            triggerError('Ingresa un número válido');
            return;
        }

        const guess = parseInt(guessValue, 10);

        // Válidación 2: Fuera del rango maxRange
        if (guess < 1 || guess > maxRange) {
            triggerError(`El número debe estar entre 1 y ${maxRange}`);
            return;
        }

        // Válidación 3: No repetir intentos del historial
        if (history.includes(guess)) {
            triggerError('Ya intentaste con este número');
            return;
        }

        // ===================================
        // Lógica: Número es un intento válido
        // ===================================
        // Arrancar timer si es el primer intento
        if (attempts === 0) {
            if (difficultyConfig[elements.difficultySelect.value].timeLimit > 0) {
                startTimer();
            }
        }

        attempts++;
        const remainingAttempts = maxAttempts - attempts;

        // Actualizar UI del contador de intentos
        elements.attemptsLeft.textContent = remainingAttempts;

        // Si hay poco margen (<= 3 intentos), mostrar en color rojo de alerta
        if (remainingAttempts <= 3) {
            elements.attemptsLeft.style.color = 'white';
            elements.attemptsLeft.style.background = 'var(--danger)';
        }

        // Mostrar bloques ocultos si es el primer intento
        elements.messageContainer.classList.remove('hidden');
        elements.historySection.classList.remove('hidden');
        elements.extraActions.classList.remove('hidden');

        // Mostrar botón de pista si lleva varios intentos fallidos (ej: 3 intentos) y le queda más de 1
        if (attempts >= 3 && remainingAttempts > 1) {
            elements.hintButton.classList.remove('hidden');
        }

        // REVISEMOS LAS 3 CONDICIONES FINALES
        if (guess === magicNumber) {
            // [A] Acertó
            endGame(true, guess);
        } else if (attempts >= maxAttempts) {
            // [B] No acertó y los intentos se agotaron (perdió)
            addHistoryItem(guess, guess > magicNumber ? 'high' : 'low');
            endGame(false, guess, false);
        } else {
            // [C] No acertó, pero tiene más intentos (sigue jugando)
            const hint = guess > magicNumber ? 'menor' : 'mayor';
            const icon = guess > magicNumber ? '↓' : '↑';
            const status = guess > magicNumber ? 'high' : 'low';

            playPopSound();

            // Mostrar pista al usuario (azul o rojo según si es bajo/alto)
            showMessage(`El número es ${hint} que ${guess}`, guess > magicNumber ? 'msg-error' : 'msg-info');

            // Añadir al historial
            addHistoryItem(guess, status, icon);

            // Limpiar input y reenfocar
            elements.guessInput.value = '';
            elements.guessInput.focus();
        }
    }

    // ====================================================
    // FUNCIÓN AUXILIAR: Añadir elemento visual al registro
    // ====================================================
    function addHistoryItem(guess, status, icon) {
        history.push(guess); // Guardar en el bloque de memoria

        // Crear elemento visual HTML dinámico
        const div = document.createElement('div');
        div.className = `history-item item-${status}`;
        div.innerHTML = `${guess} <span>${icon}</span>`;
        elements.historyList.appendChild(div);
    }

    // ================================
    // FUNCIÓN AUXILIAR: Mostrar Alerta
    // ================================
    function showMessage(text, className) {
        elements.messageContainer.classList.remove('hidden');
        // Pisar clases anteriores y sustituirlas por las que decidan el color
        elements.messageContainer.className = `message-box ${className}`;
        elements.gameMessage.textContent = text;
    }

    // ==============================================
    // FUNCIÓN: FINALIZAR EL JUEGO (Ganado o Perdido)
    // ==============================================
    function endGame(isWin, finalGuess, isTimeout = false, isSurrender = false) {
        // Bloquear UI y parar temporizador
        clearInterval(timerInterval);
        elements.guessInput.disabled = true;
        elements.guessButton.disabled = true;

        // Intercambiar botones
        elements.inputSection.classList.add('hidden');
        elements.extraActions.classList.add('hidden');
        elements.actionSection.classList.remove('hidden');

        if (isWin) {
            playWinSound();
            addHistoryItem(finalGuess, 'correct', '✨');
            showMessage(`¡Excelente! Adivinaste en ${attempts} intentos.`, 'msg-success');
        } else {
            playLoseSound();
            if (isTimeout) {
                showMessage(`¡Tiempo agotado! ⏳ El número era ${magicNumber}.`, 'msg-error');
            } else if (isSurrender) {
                const insultos = ["¡Qué gallina! 🐔", "¡Rendirse no es de campeones! 🍼", "¡Más suerte para la próxima, cobarde! 🏳️", "¡Ups, te quedó grande el reto! 🤧"];
                const rndInsulto = insultos[Math.floor(Math.random() * insultos.length)];
                showMessage(`${rndInsulto} El número era ${magicNumber}.`, 'msg-error');
            } else {
                showMessage(`¡Se acabaron tus intentos! El número era ${magicNumber}.`, 'msg-error');
            }
        }
    }

    // ==============================================
    // EVENT LISTENERS (Monitoreo de clicks y teclas)
    // ==============================================

    // Al pulsar el botón "Adivinar"
    elements.guessButton.addEventListener('click', handleGuess);

    // Al pulsar la tecla "Enter" dentro de la caja de texto
    elements.guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleGuess();
    });

    // Al pulsar "Jugar de Nuevo"
    elements.restartButton.addEventListener('click', () => {
        initAudio();
        playClickSound();
        initGame();
    });

    // Al cambiar la dificultad en el selector
    elements.difficultySelect.addEventListener('change', () => {
        playClickSound();
    });

    // Evento del Modal: Empezar juego
    elements.startGameBtn.addEventListener('click', () => {
        initAudio();
        playClickSound();

        elements.welcomeModal.classList.add('hidden');
        elements.mainGame.classList.remove('hidden');

        initGame();
    });

    // Evento para volver al menú de inicio
    elements.menuToggle.addEventListener('click', () => {
        playClickSound();
        clearInterval(timerInterval);

        // Ocultar juego principal y mostrar el modal
        elements.mainGame.classList.add('hidden');
        elements.welcomeModal.classList.remove('hidden');
    });

    // ================================
    // EVENTOS EXTRAS: PISTA Y RENDIRSE
    // ================================
    elements.giveupButton.addEventListener('click', () => {
        playClickSound();
        endGame(false, null, false, true); // true param for surrender
    });

    elements.hintButton.addEventListener('click', () => {
        if (attempts >= maxAttempts - 1) return; // No puede pedir pista si le queda solo 1 intento (moriría por pedir pista)
        playClickSound();

        // Cobrar 1 intento por la pista
        attempts++;
        const remainingAttempts = maxAttempts - attempts;
        elements.attemptsLeft.textContent = remainingAttempts;
        if (remainingAttempts <= 3) {
            elements.attemptsLeft.style.color = 'white';
            elements.attemptsLeft.style.background = 'var(--danger)';
        }

        elements.hintButton.classList.add('hidden'); // Solo 1 pista por partida

        // Lógica de Pista Matemática
        let hintStr = "";
        const isPar = magicNumber % 2 === 0;

        if (isPar) {
            hintStr += "El número es PAR";
        } else {
            hintStr += "El número es IMPAR";
        }

        // Pista extra si es múltiplo de algo común
        if (magicNumber % 5 === 0) hintStr += " y múltiplo de 5.";
        else if (magicNumber % 3 === 0) hintStr += " y múltiplo de 3.";
        else hintStr += ".";

        showMessage(`🕵️ PISTA: ${hintStr}`, 'msg-info');

        // Enfoque rápido al input después de leer
        elements.guessInput.focus();
    });
});
