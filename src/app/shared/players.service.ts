import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Player } from './player.class';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  url: string;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.url = isPlatformServer(this.platformId) ? 'http://localhost:4444/api/players' : '/api/players';
  }

  fetchPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.url)
      .pipe(
        map((data: Player[]) => {
          return data.map(player => {
            return new Player(
              player.name,
              player.lastname,
              new Date(player.birthdate),
              player.height,
              player.weight,
              player.club,
              player.avatar
            );
          });
        }),
        catchError(err => of(JSON.parse(err)))
      );
  }
}
