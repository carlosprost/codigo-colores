import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

interface Aciertos {
  exactos: number;
  aproximados: number;
  errores: number;
}

@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.scss'],
})
export class TableroComponent {
  @Output() enviarEstado: EventEmitter<string> = new EventEmitter();
  @Output() restart: EventEmitter<boolean> = new EventEmitter();

  private code: string[];

  private codeInput: Array<string> = [];

  constructor() {
    this.code = this.generarCodigo();
  }

  resolver() {
    let celdas = document.querySelectorAll(`#resolver .celda`);

    this.revisarCeldas(celdas);
    this.reiniciar();
  }

  obtenerCodigoInput(id: number): void {
    this.codeInput = [];
    let celdas = document.querySelectorAll(`#celdas${id} .celda`);

    this.revisarCeldas(celdas);
  }

  revisarCeldas(celdas: NodeListOf<Element>) {
    let elemento: HTMLDivElement = celdas[0] as HTMLDivElement;
    let id = elemento.parentElement!.id;

    celdas.forEach((celda) => {
      if (celda.classList.value != `celda celda-btn`) {
        this.codeInput.push(celda.classList[1]);
      }
    });

    this.comprobarCodigo(this.codeInput, id);
  }

  comprobarCodigo(codigo: string[], id: string) {
    let contadorExacto = 0;
    let contadorAproximado = 0;
    let errores = 0;

    for (let i = 0; i < codigo.length; i++) {
      if (codigo[i] == this.code[i]) {
        contadorExacto++;
      } else if (this.code.includes(codigo[i])) {
        contadorAproximado++;
      } else {
        errores++;
      }
    }

    let contadores: Aciertos = {
      exactos: contadorExacto,
      aproximados: contadorAproximado,
      errores: errores,
    };
    this.colocarRevision(contadores, id);
  }

  colocarRevision(counter: Aciertos, id: string) {
    let revision = document.querySelectorAll(`#${id} .celdaRevision .revision`);

    if (revision.length > 1) {
      this.revisionDeDatos(revision, counter);
      this.deshabilitarCeldas(id);
    } else if (revision.length == 0) {
      revision = document.querySelectorAll(`#${id} .celdaRevision`);
      this.revisionResuelta(revision, counter);
    }
  }

  revisionDeDatos(celdas: NodeListOf<Element>, counter: Aciertos) {
    celdas.forEach((rev) => {
      if (counter.exactos > 0) {
        rev.classList.add('exacto');
        counter.exactos--;
      } else if (counter.aproximados > 0) {
        rev.classList.add('aproximado');
        counter.aproximados--;
      } else if (counter.errores > 0) {
        rev.classList.add('error');
        counter.errores--;
      }
    });
  }

  revisionResuelta(celdas: NodeListOf<Element>, counter: Aciertos) {
    if (counter.exactos == 4) {
      celdas[0].classList.add('ganador');
      this.enviarDatos('win');
    } else {
      celdas[0].classList.add('perdedor');
      this.enviarDatos('lose');
    }
  }

  enviarDatos(dato: string) {
    this.enviarEstado.emit(dato);
  }
  generarCodigo() {
    let codigo: string[] = [];
    let optionsCode: Array<string> = [
      'red',
      'blue',
      'green',
      'yellow',
      'white',
    ];

    for (let i = 0; i < 4; i++) {
      let random = Math.floor(Math.random() * optionsCode.length);
      codigo.push(optionsCode[random]);
    }
    return codigo;
  }
  cambiarDeColorLaCelda(event: Event) {
    let celda = event.target as HTMLDivElement;
    const colors = ['white', 'blue', 'red', 'yellow', 'green'];

    if (celda.classList.contains('green')) {
      this.cambiarColor('green', colors[0], celda);
    } else {
      this.cambiarColor(
        celda.classList[1],
        colors[colors.indexOf(celda.classList[1]) + 1],
        celda
      );
    }
  }

  TodasDeBlanco(
    celdas: NodeListOf<Element>,
    revision: NodeListOf<Element>,
    revisionFinal: HTMLDivElement
  ) {
    this.celdasABlanco(celdas);
    this.revisionFinalABlanco(revisionFinal);
    this.revisionABlanco(revision);
  }

  celdasABlanco(celdas: NodeListOf<Element>) {
    celdas.forEach((celda) => {
      if (celda.classList[1] != 'celda-btn') {
        this.cambiarColor(celda.classList[1], 'white', celda as HTMLDivElement);
      }
    });
  }

  revisionABlanco(revision: NodeListOf<Element>) {
    revision.forEach((rev) => {
      if (rev.classList.contains('exacto')) {
        rev.classList.remove('exacto');
      } else if (rev.classList.contains('aproximado')) {
        rev.classList.remove('aproximado');
      } else if (rev.classList.contains('error')) {
        rev.classList.remove('error');
      }
    });
  }

  revisionFinalABlanco(revision: HTMLDivElement) {
    if (revision.classList.contains('perdedor')) {
      revision.classList.remove('perdedor');
    } else if (revision.classList.contains('ganador')) {
      revision.classList.remove('ganador');
    }
  }

  cambiarColor(color1: string, color2: string, div: HTMLDivElement) {
    div.classList.remove(color1);
    div.classList.add(color2);
  }

  deshabilitarCeldas(id: string) {
    let celdas = document.querySelectorAll(`#${id} > .celda`);
    celdas.forEach((celda) => {
      celda!.classList.add('disabledBox');
    });
  }

  reiniciar() {
    this.code = this.generarCodigo();

    this.TodasDeBlanco(
      document.querySelectorAll(`.celda`),
      document.querySelectorAll('.celdaRevision > .revision'),
      document.querySelector(`#resolver > .celdaRevision`)!
    );
    this.habilitarTodasLasCeldas();
    this.restart.emit(true);
  }

  habilitarTodasLasCeldas() {
    for (let i = 1; i <= 6; i++) {
      this.habilitarCeldas(`celdas${i} > .celda`);
    }

    this.habilitarCeldas(`resolver`);
  }

  habilitarCeldas(id: string) {
    if (id != 'resolver') {
      let celdas = document.querySelectorAll(`#${id}`);
      celdas.forEach((celda) => {
        celda!.classList.remove('disabledBox');
      });
    } else {
      let celdas = document.querySelector(`#${id}`);
      if (celdas!.classList.contains('disabledBox')) {
        celdas!.classList.remove('disabledBox');
      }
    }
  }
}
