import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Player } from './player.class';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  constructor(
    private http: HttpClient
  ) { }

  fetchPlayers(): Observable<Player[]> {
    const url = '/api/players';
    return this.http.get<Player[]>(url);
  }
}
