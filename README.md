# mertronomo-audioweb
### Enlace web:
https://juandejunin.github.io/metronomo-audioweb.github.io/

### Clonar el repositorio en local:
```
git clone https://github.com/juandejunin/metronomo-audioweb.github.io.git
```
Este proyecto se basa en un artículo desarrollado por Chris Wilson y disponible en su publicación https://web.dev/articles/audio-scheduling?hl=es-419 y su repositorio de GitHub https://github.com/cwilso/metronome.git. He adaptado y extendido el código original para satisfacer nuestras necesidades específicas y añadir nuevas funcionalidades. Agradezco a Chris Wilson por su contribución inicial y por compartir su trabajo con la comunidad de desarrollo. Su código ha sido una valiosa inspiración para este proyecto.



## Metronome.js

Se trata de un código JavaScript para crear un metrónomo utilizando el API de Audio Web. El metrónomo genera una secuencia de pulsos rítmicos con la capacidad de ajustar el tempo y la resolución de las notas.

## mertronomeworker.js  (Web Worker)

este código define un Web Worker que maneja un temporizador. Cuando recibe un mensaje "start", 
inicia un temporizador que envía mensajes de "tick" al hilo principal cada intervalo de tiempo
especificado. Si recibe un mensaje que contiene información sobre un nuevo intervalo de tiempo, 
actualiza el intervalo y ajusta el temporizador en consecuencia. Cuando recibe un mensaje "stop",
detiene el temporizador. Finalmente, envía un mensaje al hilo principal cuando se carga el Worker.

## Ejecución:

Para utilizar el metrónomo, simplemente abre el archivo HTML en un navegador web compatible con el API de Audio Web. Puedes ajustar el tempo haciendo clic en los botones de aumento o disminución, y puedes iniciar o detener la reproducción haciendo clic en el botón de reproducción.