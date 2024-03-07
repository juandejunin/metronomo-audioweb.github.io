
// este código define un Web Worker que maneja un temporizador. Cuando recibe un mensaje "start", 
// inicia un temporizador que envía mensajes de "tick" al hilo principal cada intervalo de tiempo
//  especificado. Si recibe un mensaje que contiene información sobre un nuevo intervalo de tiempo, 
//  actualiza el intervalo y ajusta el temporizador en consecuencia. Cuando recibe un mensaje "stop",
//   detiene el temporizador. Finalmente, envía un mensaje al hilo principal cuando se carga el Worker.

// Variables para controlar el temporizador y el intervalo de tiempo
var timerID = null;
var interval = 100;

// Función que se ejecuta cuando el Web Worker recibe un mensaje
self.onmessage = function(e) {
    // Comprueba si el mensaje recibido es "start"
    if (e.data == "start") {
        console.log("starting");
        // Inicia un temporizador que envía un mensaje "tick" al hilo principal cada intervalo de tiempo
        timerID = setInterval(function() {
            postMessage("tick");
        }, interval);
    }
    // Comprueba si el mensaje recibido contiene información sobre el intervalo de tiempo
    else if (e.data.interval) {
        console.log("setting interval");
        // Actualiza el intervalo de tiempo con el valor recibido del mensaje
        interval = e.data.interval;
        console.log("interval=" + interval);
        // Si ya hay un temporizador en funcionamiento, detenlo y establece uno nuevo con el nuevo intervalo
        if (timerID) {
            clearInterval(timerID);
            timerID = setInterval(function() {
                postMessage("tick");
            }, interval);
        }
    }
    // Comprueba si el mensaje recibido es "stop"
    else if (e.data == "stop") {
        console.log("stopping");
        // Detiene el temporizador
        clearInterval(timerID);
        timerID = null;
    }
};

// Envía un mensaje al hilo principal cuando se carga el Worker
postMessage('hi there');
