# Número Mágico

¡Bienvenido a **Número Mágico**! Un divertido y moderno minijuego web interactivo desarrollado con puro HTML, CSS y JavaScript (sin basarse en librerías o frameworks externos).

## Objetivo del Juego
El juego ha "pensado" automáticamente en un número secreto del **1 al 100**. Tu misión principal es descubrir cuál es ese número mágico usando pistas de "caliente/frío" (mayor o menor), ¡pero ten cuidado! Tienes un límite de **10 intentos** máximo para encontrar la respuesta correcta.

## Características y Funcionalidades
A través del uso de tecnologías web vanilla, este juego incluye:
- **Tecnología Frontend de Vórtice:** Interfaz neumórfica minimalista "Light Mode" brillante, atractiva al usuario final, empleando la fuente moderna _Poppins_ de Google Fonts.
- **Validación Robusta de Entradas:** El sistema valida entradas vacías, o que no sean números válidos ni se encuentren dentro del rango del `1` al `100`.
- **Registro Antimemoria:** Impide que gastes un intento por introducir un número previamente jugado accidentalmente.
- **Historial Interactivo de Intentos:** Muestra el listado de todos tus intentos en formatos de etiquetas (pills) indicando visualmente con colores suaves e iconos de flecha si el número secreto verdadero es más alto (rojo), más bajo (azul) o en su defecto si lograste acertar espectacularmente (verde).
- **Control de Presión Térmica:** ¡El color del contador de intentos alertará agresivamente a rojo brillante cuando apenas te queden `3` intentos o menos!
- **Feedback Constante (UI):** Pistas de texto que actualizan en tiempo real después de cada adivinanza errónea indicando con suavidad hacia donde ir.
- **Botón de Reset:** Un botón que restablece tu salud (intentos), vacía todo de la memoria de la pantalla, limpia el tablero inicial y genera instántaneamente un nuevo número secreto para poder disfrutar un nuevo juego sin recargar el navegador Web.

## ¿Cómo Jugar?
1. Visualiza tu objetivo actual y luego sitúa el click izquierdo (o toca) sobre la caja central del teclado con la etiqueta de texto `00`.
2. Digita tu adivinanza (debe estar entre 1 y 100).
3. Presiona rápidamente el botón principal color índigo de **"Adivinar"** (O bien, presiona tranquilamente la tecla de salto de línea `Enter` / `Intro` en tu ordenador de preferencia).
4. Lee detalladamente el recuadro blanco de alertas de sistema, revisa el estatus de tu progreso actual y prepara el mejor número en contra-ataque a tu favor guiándote por si dice _"mayor"_ o _"menor"_.
5. Festeja en lo alto o llora ante la derrota. 

## Tecnologías Utilizadas
- **HTML5:** Marcado semántico y estructura flexible del DOM.
- **CSS3:** Estilización moderna (sombreados neumórficos, transiciones, efectos hover, fondos degradados o variables dinámicas CSS).
- **JavaScript Moderno (ES6+):** Motor lógico, validación en caliente, arreglo dinámico de componentes y renderizado interactivo DOM directo hacia la tarjeta central de la WebApp.
