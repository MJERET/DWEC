// -------------------- Función user -------------------- 
function user() {
    let usuario;
    // Creación de las celdas.
    usuario = Number(prompt("Introduce el número de casillas por fila (max 50)"));
    //Para que el usuario no pueda introducir un número menor de 1 y mayor de 50, como también no puede poner nada
    if (isNaN(usuario) || usuario < 1 || usuario > 50) {
        throw new Error("Entrada no válida. Debe ser un número entre 1 y 50.");
    }
    return usuario;
}

// -------------------- Función para elegir minas -------------------- 
function colocarBombasTableroJS(casilla, cantidadMinas) {
    let minas = new Set();
    let totalCasillas = casilla * casilla;
    //condición para que el usuario no pueda poner más minas que casillas
    if (cantidadMinas > totalCasillas) {
        throw new Error("Número de minas excede el total de casillas.");
    }
    //Posición aleatoria de la mina y casiila
    while (minas.size < cantidadMinas) { //Mienrtas la cantidad de minas sea menor que la cantidad de minas establecidad por el usuario:
        //con una posición aleaoria del Math.random a una casilla aleatoria
        let posicionAleatoria = Math.floor(Math.random() * totalCasillas);
        minas.add(posicionAleatoria);
    }

    return minas;
}

// -------------------- Función cuadricula -------------------- 
function dibujarTableroHTML(casilla, cantidadMinas) {
    const constante = document.getElementById("bloques");
    let cuadriculaHTML = "";
    minas = colocarBombasTableroJS(casilla, cantidadMinas); // Generamos minas aleatorias
    //Para la condición de victoria
    casillasReveladas = 0;
    totalCasillasSeguras = casilla * casilla - cantidadMinas; //generar la condición de victoria

    // Recorremos la longitud del número introducido por el usuario
    for (let fila = 0; fila < casilla; fila++) {
        cuadriculaHTML += "<div class='bloques'>";
        //Para las columnas  
        for (let columna = 0; columna < casilla; columna++) {
            // fila por el número de casilla más columna para hacer un id
            let index = fila * casilla + columna;
            cuadriculaHTML += `<div class='cuadrado' id="celda-${index}" onclick="revelarCelda(${index})" oncontextmenu="colocarBandera(event, ${index})"></div>`; //Imprimimos la casilla
        }
        cuadriculaHTML += "</div>";
    }
    
    constante.innerHTML = cuadriculaHTML;
}

// -------------------- Función para contar minas cercanas -------------------- 
function contarMinasCercanas(fila, columna, casilla) {
    let contador = 0;
    
    // Direcciones relativas para recorrer las casillas vecinas
    const direcciones = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],         [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];  //Para mirar las casillas miramos arriba y abajo en la fila y columna
    //Para ver la posición hacemos el siguiente bucle:
    for (let i = 0; i < direcciones.length; i++) {
        let nuevaFila = fila + direcciones[i][0];   //Primero miramos la fila segun el valor de i
        let nuevaColumna = columna + direcciones[i][1]; // Después miramos la columna según el valor de i
        // Verificamos si la nueva fila y columna están dentro de los límites del tablero
        if (nuevaFila >= 0 && nuevaFila < casilla && nuevaColumna >= 0 && nuevaColumna < casilla) {
            // Calculamos el índice de la celda vecina en base a la nueva fila y columna
            let index = nuevaFila * casilla + nuevaColumna;
            // Si la celda vecina contiene una mina, incrementamos el contador
            if (minas.has(index)) { 
                contador++; //pone el número de que tan alejado está de la bomba
            }
        }
    }
    return contador;
}

// -------------------- Función para colocar bandera -------------------- 
function colocarBandera(event, index) {
    //Mediante un evento cuando clickeamos hacemos:
    event.preventDefault(); // Evita el menú contextual
    let celda = document.getElementById(`celda-${index}`); //Una variable que guarde la celda y su respectivo id
    if (!celda.innerHTML || celda.innerHTML === "🚩") {    // Si la celda está vacía o ya tiene una bandera
        celda.innerHTML = celda.innerHTML === "🚩" ? "" : "🚩"; // Alterna entre colocar y quitar la bandera
    }
}

// -------------------- Función para revelar una celda al hacer clic -------------------- 
function revelarCelda(index) {
    let fila = Math.floor(index / casilla); // Calcula la fila de la celda
    let columna = index % casilla; // Calcula la columna de la celda
    let celda = document.getElementById(`celda-${index}`); // Obtiene la celda del DOM

    if (minas.has(index)) { // Verifica si hay una mina en la celda
        celda.innerHTML = "💣"; // Muestra una bomba
        celda.style.backgroundColor = "red"; // Cambia el fondo a rojo
        alert("¡Boom! Has perdido."); // Muestra un mensaje de pérdida
        revelarTodasLasMinas(); // Revela todas las minas
        bloquearTablero(); // Bloquea el tablero
    } else {
        let minasCercanas = contarMinasCercanas(fila, columna, casilla); // Cuenta las minas cercanas
        if (minasCercanas > 0) {
            celda.innerHTML = minasCercanas; // Muestra el número de minas cercanas
        } else {
            celda.innerHTML = ""; // Deja la celda vacía
        }

        celda.style.backgroundColor = "#ccc"; // Cambia el fondo a gris
        casillasReveladas++; // Incrementa el contador de celdas reveladas
        verificarVictoria(); // Verifica si se ha ganado el juego
    }

    celda.onclick = null; // Desactiva el click en la celda
}

// -------------------- Función para verificar si el jugador ganó -------------------- 
function verificarVictoria() {
    if (casillasReveladas === totalCasillasSeguras) {
        alert("¡Felicidades! Has ganado.");
        bloquearTablero();
    }
}

// -------------------- Función para revelar todas las minas al perder -------------------- 
function revelarTodasLasMinas() {
    minas.forEach(index => {
        let celda = document.getElementById(`celda-${index}`);
        celda.innerHTML = "💣";
        celda.style.backgroundColor = "red";
    });
}

// -------------------- Función para bloquear el tablero -------------------- 
//Si la persona ha perdido o ha ganado bloqueamos el tablero
function bloquearTablero() {
    let celdas = document.getElementsByClassName("cuadrado");
    for (let i = 0; i < celdas.length; i++) {
        celdas[i].onclick = null;
    }
}

// -------------------- Iniciar el juego -------------------- 
function iniciarJuego() {
    casilla = user(); //Llama a usuario para pedir el número de casillas
    cantidadMinas = Number(prompt(`Introduce la cantidad de minas (máx ${casilla * casilla})`)); //Pedimos el número de bombas:
    dibujarTableroHTML(casilla, cantidadMinas);
}
// -------------------- DIficultades del juego facil a dificil -------------------- 
function facil() {
    casilla = 10;
    cantidadMinas = 5;
    dibujarTableroHTML(casilla, cantidadMinas);
}
function dificil(){
    casilla = 20;
    cantidadMinas = 10
    dibujarTableroHTML(casilla, cantidadMinas);
}
function muyDificil(){
    casilla = 50
    cantidadMinas = 20
    dibujarTableroHTML(casilla, cantidadMinas);
} // todas las funciones son iguales, solo varia el número de la casilla con el número de minas

//Variables definidas.
let casilla, cantidadMinas, minas, casillasReveladas, totalCasillasSeguras;
//Casilla es el valor que le pedimos al usuario o dependiendo del modo tiene un valor concreto
//cantidadMinas es lo mismo que casillas solo que para las bombas
//minas Variable usada para la generación aleatoria
//casillaRevelada Valor que tiene que ser igual a totalCasillaSegura para ganar
//totalCasillasSeguras Valor para decirnos cuando ganamos la partida.