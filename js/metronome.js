var audioContext = null;
var unlocked = false;
var isPlaying = false; // ¿Estamos sonando actualmente??
var startTime; //  La hora de inicio de toda la secuencia.
var current16thNote; // ¿Qué nota está programada por última vez actualmente?
var tempo = 120.0; // tempo (en beats por minuto)
var lookahead = 25.0; // Con qué frecuencia llamar a la función de programación (en milisegundos)

var scheduleAheadTime = 0.1; // // Con qué anticipación programar el audio (seg.)
// Esto se calcula a partir de la anticipación y se superpone
// con el siguiente intervalo (en caso de que el temporizador llegue tarde)

var nextNoteTime = 0.0; // cuando se debe tocar la próxima nota.
var noteResolution = 0; // 0 == 16th, 1 == 8th, 2 == quarter note
var noteLength = 0.05; // longitud del "beep" (en segundos)

var last16thNoteDrawn = -1; // la última "caja" que dibujamos en la pantalla
var notesInQueue = []; // las notas que se han colocado en el audio web,
// y que pueden o no haberse reproducido todavía. {nota, tiempo}
var timerWorker = null; // El Web Worker usado para enviar mensajes de temporizador

// Primero, vamos a shim la API requestAnimationFrame, con un fallback de setTimeout
window.requestAnimFrame = window.requestAnimationFrame;

function nextNote() {
  // Avanza la nota actual y el tiempo por una nota de 16th...
  var secondsPerBeat = 60.0 / tempo; // Observa que esto recoge el valor de tempo ACTUAL
  // para calcular la longitud del beat.
  nextNoteTime += 0.25 * secondsPerBeat; // Añade la longitud del beat al tiempo del último beat

  current16thNote++; // Avanza el número de beat, volviendo a cero si llega a 16
  if (current16thNote == 16) {
    current16thNote = 0;
  }
}

function scheduleNote(beatNumber, time) {
  // añade la nota a la cola, incluso si no estamos tocando.
  notesInQueue.push({ nota: beatNumber, tiempo: time });

  if (noteResolution == 1 && beatNumber % 2) return; // no estamos tocando notas 16th que no son de 8th
  if (noteResolution == 2 && beatNumber % 4) return; // no estamos tocando notas 8th que no son de quarter

  // crea un oscilador
  var osc = audioContext.createOscillator();
  osc.connect(audioContext.destination);
  if (beatNumber % 16 === 0)
    // beat 0 == tono alto
    osc.frequency.value = 880.0;
  else if (beatNumber % 4 === 0)
    // quarter notes = tono medio
    osc.frequency.value = 440.0;
  // otras 16th notes = tono bajo
  else osc.frequency.value = 220.0;

  osc.start(time);
  osc.stop(time + noteLength);
}

function scheduler() {
  // mientras haya notas que necesiten sonar antes del próximo intervalo,
  // prográmalas y avanza el puntero.
  while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
    scheduleNote(current16thNote, nextNoteTime);
    nextNote();
  }
}

function play() {
  if (!audioContext) audioContext = new AudioContext();

  if (!unlocked) {
    // reproduce un buffer silencioso para desbloquear el audio
    var buffer = audioContext.createBuffer(1, 1, 22050);
    var node = audioContext.createBufferSource();
    node.buffer = buffer;
    node.start(0);
    unlocked = true;
  }

  isPlaying = !isPlaying;

  if (isPlaying) {
    // empezar a tocar
    current16thNote = 0;
    nextNoteTime = audioContext.currentTime;
    timerWorker.postMessage("start");
    return "stop";
  } else {
    timerWorker.postMessage("stop");
    return "play";
  }
}

function init() {
  timerWorker = new Worker("js/metronomeworker.js");

  timerWorker.onmessage = function (e) {
    if (e.data == "tick") {
      // console.log("tick!");
      scheduler();
    } else console.log("message: " + e.data);
  };
  timerWorker.postMessage({ interval: lookahead });
}

window.addEventListener("load", init);
