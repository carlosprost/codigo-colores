class Celda {
  private celda: HTMLDivElement = document.createElement('div');

  constructor() {}

  crearCelda() {
    this.celda.style.width = '100px';
    this.celda.style.height = '100px';
    this.celda.style.border = '1px solid black';

    return this.celda;
  }
}

class Celdas {
  private columnas: number = 4;
  private celdas: HTMLDivElement = document.createElement('div');
  private celda!: HTMLDivElement;
  private button: HTMLButtonElement = document.createElement('button');
  private idBtn: number;

  constructor(id: number) {
    this.idBtn = id;
  }

  crearCeldas() {
    this.celdas.style.display = 'flex';
    this.celdas.style.justifyContent = 'center';
    this.celdas.style.alignItems = 'center';

    this.button.classList.add('btn');
    this.button.classList.add('btn-success');
    this.button.innerHTML = '<i class="bi bi-check"></i>';
    this.button.id = 'comprobar' + this.idBtn;

    for (let i = 0; i < this.columnas; i++) {
      this.celda = new Celda().crearCelda();
      this.celdas.appendChild(this.celda);
    }

    this.celdas.appendChild(this.button);

    return this.celdas;
  }
}

export class Tablero {
  filas: number = 4;
  tablero: HTMLDivElement = document.createElement('div');
  celdas!: HTMLDivElement;
  contenedor!: HTMLDivElement;

  constructor(container: HTMLDivElement) {
    this.contenedor = container;
    this.crearTablero();
  }

  crearTablero() {
    this.tablero.style.width = '500px';
    this.tablero.style.height = '500px';
    this.tablero.style.border = '1px solid black';
    this.tablero.style.display = 'flex';
    this.tablero.style.flexDirection = 'column';
    this.tablero.style.justifyContent = 'center';
    this.tablero.style.alignItems = 'center';
    for (let i = 0; i < this.filas; i++) {
      this.celdas = new Celdas(i).crearCeldas();
      this.celdas.id = i.toString();
      this.tablero.appendChild(this.celdas);
    }

    this.contenedor.appendChild(this.tablero);
  }
}
