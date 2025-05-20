// -------------------- Variables globales -------------------- 
let minas = new Set();
let casillasReveladas = 0;
let totalCasillas = 0;
let juegoTerminado = false; // Controla si el juego ha terminado

// -------------------- Función para iniciar el juego -------------------- 
function iniciarJuego() {
    let casilla = Number(prompt("Introduce el número de casillas por fila (max 50)"));

    if (isNaN(casilla) || casilla < 1 || casilla > 50) {
        alert("Entrada no válida. Debe ser un número entre 1 y 50.");
        return;
    }

    let cantidadMinas = Number(prompt(`Introduce la cantidad de minas (máx ${casilla * casilla})`));

    if (isNaN(cantidadMinas) || cantidadMinas < 1 || cantidadMinas > casilla * casilla) {
        alert("Número de minas no válido.");
        return;
    }

    casillasReveladas = 0; // Reiniciar el contador
    totalCasillas = casilla * casilla; // Guardar el total de casillas
    juegoTerminado = false; // Reiniciar estado del juego

    cuadricula(casilla, cantidadMinas);
}

// -------------------- Función para elegir minas -------------------- 
function seleccionarMinas(casilla, cantidadMinas) {
    let minas = new Set();
    let totalCasillas = casilla * casilla;

    while (minas.size < cantidadMinas) {
        let posicionAleatoria = Math.floor(Math.random() * totalCasillas);
        minas.add(posicionAleatoria); // Garantiza que no haya posiciones repetidas
    }

    return minas;
}

// -------------------- Función cuadricula -------------------- 
function cuadricula(casilla, cantidadMinas) {
    const constante = document.getElementById("bloques");
    let cuadriculaHTML = "";
    minas = seleccionarMinas(casilla, cantidadMinas); // Generamos minas aleatorias

    for (let fila = 0; fila < casilla; fila++) {
        cuadriculaHTML += "<div class='bloques'>";  
        for (let columna = 0; columna < casilla; columna++) {
            let index = fila * casilla + columna;
            cuadriculaHTML += `<div class='cuadrado' id="celda-${index}" onclick="revelarCelda(${index}, ${casilla})"></div>`;
        }
        cuadriculaHTML += "</div>";
    }

    constante.innerHTML = cuadriculaHTML;
}

// -------------------- Función para contar minas cercanas -------------------- 
function contarMinasCercanas(index, casilla) {
    let fila = Math.floor(index / casilla);
    let columna = index % casilla;
    let contador = 0;

    let direcciones = [
        [-1, -1], [-1, 0], [-1, 1], 
        [0, -1],          [0, 1], 
        [1, -1], [1, 0], [1, 1]
    ];

    for (let [dx, dy] of direcciones) {
        let nuevaFila = fila + dx;
        let nuevaColumna = columna + dy;
        let nuevoIndex = nuevaFila * casilla + nuevaColumna;

        if (nuevaFila >= 0 && nuevaFila < casilla && nuevaColumna >= 0 && nuevaColumna < casilla) {
            if (minas.has(nuevoIndex)) {
                contador++;
            }
        }
    }

    return contador;
}

// -------------------- Función para revelar una celda al hacer clic -------------------- 
function revelarCelda(index, casilla) {
    if (juegoTerminado) return; // Evita jugar después de ganar o perder

    let celda = document.getElementById(`celda-${index}`);

    if (!celda || celda.innerHTML !== "") return; // Evita revelar dos veces la misma casilla

    // Si la casilla tiene una mina, el jugador pierde
    if (minas.has(index)) {
        celda.innerHTML = "💣";
        celda.style.backgroundColor = "red";
        alert("¡Boom! Has perdido.");
        juegoTerminado = true; // Detener el juego
        revelarTodasLasMinas(); // Muestra todas las minas al perder
        return;
    }

    let minasCercanas = contarMinasCercanas(index, casilla);
    celda.innerHTML = minasCercanas > 0 ? minasCercanas : "";
    celda.style.backgroundColor = "#ccc";
    casillasReveladas++; // Aumenta el contador de casillas descubiertas

    // Si no hay minas cercanas, revelar automáticamente las celdas vecinas
    if (minasCercanas === 0) {
        revelarCeldasVacias(index, casilla);
    }

    // Verificar condición de victoria
    verificarVictoria();
}

// -------------------- Función para revelar celdas vacías automáticamente -------------------- 
function revelarCeldasVacias(index, casilla) {
    let fila = Math.floor(index / casilla);
    let columna = index % casilla;

    let direcciones = [
        [-1, -1], [-1, 0], [-1, 1], 
        [0, -1],          [0, 1], 
        [1, -1], [1, 0], [1, 1]
    ];

    for (let [dx, dy] of direcciones) {
        let nuevaFila = fila + dx;
        let nuevaColumna = columna + dy;
        let nuevoIndex = nuevaFila * casilla + nuevaColumna;

        if (nuevaFila >= 0 && nuevaFila < casilla && nuevaColumna >= 0 && nuevaColumna < casilla) {
            let celdaVecina = document.getElementById(`celda-${nuevoIndex}`);

            if (celdaVecina && celdaVecina.innerHTML === "") {
                revelarCelda(nuevoIndex, casilla);
            }
        }
    }
}

// -------------------- Función para verificar si el jugador ha ganado -------------------- 
function verificarVictoria() {
    let casillasSinMinas = totalCasillas - minas.size;
    
    if (casillasReveladas === casillasSinMinas) {
        alert("🎉 ¡Felicidades, ganaste! 🎉");
        juegoTerminado = true; // Detener el juego
        revelarTodasLasMinas(); // Muestra las minas restantes para finalizar
    }
}

// -------------------- Función para revelar todas las minas al perder o ganar -------------------- 
function revelarTodasLasMinas() {
    minas.forEach(index => {
        let celda = document.getElementById(`celda-${index}`);
        if (celda) {
            celda.innerHTML = "💣";
            celda.style.backgroundColor = "red";
        }
    });
}
