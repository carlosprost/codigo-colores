import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Adivina el código';
  year = new Date().getFullYear();
  timer: string = '00:00';
  puntuacion: string = '0';

  /* Estado del Juego */
  estadoJuego: string = 'iniciar';

  /* tiempo */
  minutos: number = 0;
  segundos: number = 0;
  intervalo: any;

  /* Puntos */
  tiempoSeccion!: string;
  puntos: number = 0;

  /* Botón */
  btnStart: boolean = true;
  btnRestart: boolean = false;

  startOrStop() {
    if (this.btnStart) {
      this.start();
      this.btnStart = false;
    } else {
      this.stop();
      this.btnStart = true;
    }
  }

  start() {
    this.diplayGanadorOPerdedor('none', 'none', 'none');
    this.habilitarTablero(true);
    this.temporizadorStart();
  }

  restart() {
    if (!this.btnStart && this.btnRestart) {
      this.stop();

      this.puntuacion = '0';
      this.estadoJuego = 'iniciar';
      this.tiempoSeccion = '';
      this.minutos = 0;
      this.segundos = 0;
      this.start();
      this.btnRestart = false;
    }
  }

  stop() {
    this.temporizardorStop();
    this.habilitarTablero(false);
    this.sumarPuntos();
  }

  activarRestart(event: boolean){
    this.btnRestart = event;
  }

  /* Juego */
  habilitarTablero(h: boolean) {
    let tablero = document.getElementById('tablero');

    if (h) {
      tablero?.classList.remove('disabledBox');
    } else if (!h) {
      tablero?.classList.add('disabledBox');
    }
  }

  /* Estado del Juego */
  diplayGanadorOPerdedor(marco: string, up: string, down: string) {
    let resultado = document.querySelector('.mensaje') as HTMLDivElement;
    resultado.style.display = marco;

    let pulgarUp = document.querySelector(
      '.acierto > .imgs > .win'
    ) as HTMLImageElement;
    pulgarUp.style.display = up;

    let pulgarDown = document.querySelector(
      '.acierto > .imgs > .lose'
    ) as HTMLImageElement;
    pulgarDown.style.display = down;
  }
  hayGanadorOPerdedor(event: string) {
    this.estadoJuego = event;

    if (this.estadoJuego == 'win') {
      this.diplayGanadorOPerdedor('block', 'block', 'none');

      this.stop();
    } else if (this.estadoJuego == 'lose') {
      this.diplayGanadorOPerdedor('block', 'none', 'block');

      this.stop();
    }
  }

  /* Puntaje */

  sumarPuntos() {
    if (this.estadoJuego == 'win') {
      this.puntos = 10 + this.puntajePorTiempo();
    } else if (this.estadoJuego == 'lose') {
      this.puntos = 0;
    }

    this.puntuacion = this.puntos.toString();
  }

  puntajePorTiempo(): number {
    let tiempo = this.tiempoSeccion.split(':');
    let minutos = parseInt(tiempo[0]);

    return 5 - minutos;
  }

  /* Timer */
  temporizadorStart() {
    this.intervalo = setInterval(() => {
      let m = '';
      let s = '';
      this.segundos++;
      if (this.segundos == 60) {
        this.minutos++;
        this.segundos = 0;
      }

      m = `${this.minutos}`;
      s = `${this.segundos}`;

      if (this.minutos < 10) {
        m = `0${this.minutos}`;
      }

      if (this.segundos < 10) {
        s = `0${this.segundos}`;
      }

      this.timer = m + ':' + s;
    }, 1000);
  }

  temporizardorStop() {
    this.tiempoSeccion = this.timer;
    this.timer = '00:00';
    clearInterval(this.intervalo);
  }
}
