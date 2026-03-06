document.addEventListener('DOMContentLoaded', () => {
    // =========================================================
    // VARIABLES DE ESTADO DEL JUEGO
    // =========================================================
    let magicNumber;          // Número aleatorio secreto
    let attempts;             // Contador actual de intentos
    const maxAttempts = 10;   // Máximo de intentos permitidos
    let history = [];         // Arreglo para guardar los números y prevenir repetidos

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
        actionSection: document.getElementById('action-section')
    };

    // =========================================================
    // FUNCIÓN: INICIALIZAR EL JUEGO (O REINICIAR)
    // =========================================================
    function initGame() {
        // 1. Generar número mágico entre 1 y 100
        magicNumber = Math.floor(Math.random() * 100) + 1;
        attempts = 0;
        history = [];

        // 2. Reiniciar interfaz (Pill de intentos y colores)
        elements.attemptsLeft.textContent = maxAttempts;
        elements.attemptsLeft.style.color = 'var(--primary)';
        elements.attemptsLeft.style.background = '#e0e7ff';

        // 3. Reactivar inputs
        elements.guessInput.value = '';
        elements.guessInput.disabled = false;
        elements.guessButton.disabled = false;

        // 4. Ocultar mensajes e historial viejo
        elements.messageContainer.classList.add('hidden');
        elements.gameMessage.className = '';
        elements.historySection.classList.add('hidden');
        elements.historyList.innerHTML = '';

        // 5. Ocultar botón "Reiniciar" y mostrar botón "Adivinar"
        elements.actionSection.classList.add('hidden');
        elements.inputSection.classList.remove('hidden');

        // Enfocar el input para escribir de inmediato
        elements.guessInput.focus();

        // Log solo para pruebas o desarrollo oculto
        // console.log("Número mágico:", magicNumber);
    }

    // =========================================================
    // FUNCIÓN: GESTIONAR LA LÓGICA DE Adivinar
    // =========================================================
    function handleGuess() {
        const guessValue = elements.guessInput.value;

        // Válidación 1: Estar vacío o no ser número
        if (!guessValue || isNaN(guessValue)) {
            showMessage('Ingresa un número válido', 'msg-warning');
            return;
        }

        const guess = parseInt(guessValue, 10);

        // Válidación 2: Fuera del rango 1 al 100
        if (guess < 1 || guess > 100) {
            showMessage('El número debe ser del 1 al 100', 'msg-warning');
            return;
        }

        // Válidación 3: No repetir intentos del historial
        if (history.includes(guess)) {
            showMessage('Ya intentaste con este número', 'msg-warning');
            return;
        }

        // ==============================================
        // Lógica: Número es un intento válido
        // ==============================================
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

        // REVISEMOS LAS 3 CONDICIONES FINALES
        if (guess === magicNumber) {
            // [A] Acertó
            endGame(true, guess);
        } else if (attempts >= maxAttempts) {
            // [B] No acertó y los intentos se agotaron (perdió)
            addHistoryItem(guess, guess > magicNumber ? 'high' : 'low');
            endGame(false, guess);
        } else {
            // [C] No acertó, pero tiene más intentos (sigue jugando)
            const hint = guess > magicNumber ? 'menor' : 'mayor';
            const icon = guess > magicNumber ? '↓' : '↑';
            const status = guess > magicNumber ? 'high' : 'low';

            // Mostrar pista al usuario (azul o rojo según si es bajo/alto)
            showMessage(`El número es ${hint} que ${guess}`, guess > magicNumber ? 'msg-error' : 'msg-info');

            // Añadir al historial
            addHistoryItem(guess, status, icon);

            // Limpiar input y reenfocar
            elements.guessInput.value = '';
            elements.guessInput.focus();
        }
    }

    // =========================================================
    // FUNCIÓN AUXILIAR: Añadir elemento visual al registro
    // =========================================================
    function addHistoryItem(guess, status, icon) {
        history.push(guess); // Guardar en el bloque de memoria

        // Crear elemento visual HTML dinámico
        const div = document.createElement('div');
        div.className = `history-item item-${status}`;
        div.innerHTML = `${guess} <span>${icon}</span>`;
        elements.historyList.appendChild(div);
    }

    // =========================================================
    // FUNCIÓN AUXILIAR: Mostrar Alerta
    // =========================================================
    function showMessage(text, className) {
        elements.messageContainer.classList.remove('hidden');
        // Pisar clases anteriores y sustituirlas por las que decidan el color
        elements.messageContainer.className = `message-box ${className}`;
        elements.gameMessage.textContent = text;
    }

    // =========================================================
    // FUNCIÓN: FINALIZAR EL JUEGO (Ganado o Perdido)
    // =========================================================
    function endGame(isWin, finalGuess) {
        // Bloquear UI
        elements.guessInput.disabled = true;
        elements.guessButton.disabled = true;

        // Intercambiar botones (Adivinar por Reiniciar)
        elements.inputSection.classList.add('hidden');
        elements.actionSection.classList.remove('hidden');

        if (isWin) {
            addHistoryItem(finalGuess, 'correct', '✨');
            showMessage(`¡Excelente! Adivinaste en ${attempts} intentos.`, 'msg-success');
        } else {
            showMessage(`¡Se acabaron tus intentos! El número era ${magicNumber}.`, 'msg-error');
        }
    }

    // =========================================================
    // EVENT LISTENERS (Monitoreo de clicks y teclas)
    // =========================================================

    // Al pulsar el botón "Adivinar"
    elements.guessButton.addEventListener('click', handleGuess);

    // Al pulsar la tecla "Enter" dentro de la caja de texto
    elements.guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleGuess();
    });

    // Al pulsar "Jugar de Nuevo"
    elements.restartButton.addEventListener('click', initGame);

    // =========================================================
    // ARRANQUE AUTOMÁTICO INICIAL
    // =========================================================
    initGame();
});
