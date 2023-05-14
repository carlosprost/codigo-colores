import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StartGameService {
  private _startGame: boolean;
  constructor() { 
    this._startGame = false;
  }

  startGame(valor:boolean): void {
    this._startGame = valor;
    
  }

  isStartGame$(): boolean {
    return this._startGame
  }
}
