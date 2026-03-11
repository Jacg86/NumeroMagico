# Número Mágico

Sistema interactivo web basado en la lógica de adivinanza de números con límite de tiempo e intentos. Desarrollado con HTML, CSS y JavaScript Vanilla.

## Objetivo del Proyecto
El objetivo principal de esta aplicación es adivinar un número generado aleatoriamente por el sistema dentro de un rango predefinido. El usuario cuenta con un límite de intentos y, dependiendo del nivel de dificultad seleccionado, restricciones de tiempo. El sistema proporciona retroalimentación matemática constante para guiar al usuario hacia la resolución del desafío.

## Características Principales

- **Niveles de Dificultad Adaptativos:** Implementación de tres niveles distintos: Fácil (1-50), Medio (1-100) y Difícil (1-500).
- **Sistema Contrarreloj:** Integración de un temporizador de 60 segundos exclusivo para el modo de mayor dificultad.
- **Soporte de Tema Oscuro:** Alternancia dinámica entre modo claro y oscuro, preservando la preferencia del usuario mediante el uso de `localStorage`.
- **Integración de Web Audio API:** Generación asíncrona de efectos sonoros sintetizados para acciones clave interactuando con el DOM (clics, alertas, fin de juego).
- **Herramientas de Asistencia (Pistas):** Lógica matemática para proporcionar pistas sobre la paridad y los submúltiplos del número objetivo, a cambio de una reducción en los intentos.
- **Feedback Visual y Habilidad Motriz:** Retroalimentación inmediata del estado de la entrada a través de animaciones por keyframes (`shake`), estado cromático de componentes y la adición del motor externo `canvas-confetti` para indicadores de éxito.

## Instrucciones de Uso
1. Ejecute el archivo `index.html` en un navegador web compatible.
2. En la interfaz modal de inicio, seleccione el nivel de dificultad deseado y proceda a inicializar el sistema.
3. Ingrese un valor numérico entero en el campo correspondiente.
4. Presione el botón de validación o utilice la tecla `Enter`.
5. Observe el panel inferior del historial para ajustar sus estimaciones subsecuentes basándose en si el sistema indica que el objetivo es de valor mayor o menor.
6. Emplee los botones extras para solicitar asistencia o reiniciar los valores y volver al menú inicial (`🏠`).

## Stack Tecnológico Utilizado
- **HTML5:** Marcado rígido y semántico de la estructura general de la aplicación.
- **CSS3:** Diseño responsivo basado en CSS Variables (`data-theme`), esquemas neumórficos y animaciones de transición.
- **JavaScript Moderno (ES6+):** Script principal para la manipulación del DOM, el procesamiento algorítmico, el control de temporizadores asíncronos y la modulación de frecuencias sonoras mediante la interfaz nativa Web Audio API.
