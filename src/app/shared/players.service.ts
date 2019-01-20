import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Player } from './player.class';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  url: string;
  playerDialogOpened: boolean;
  player: Player;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.url = isPlatformServer(this.platformId) ? 'http://localhost:4444/api/players' : '/api/players';
  }

  openPlayerDialog(player: Player): void {
    this.player = player;
    this.playerDialogOpened = true;
  }

  closePlayerDialog(): void {
    this.playerDialogOpened = false;
    this.player = null;
  }

  fetchPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.url)
      .pipe(
        map((data: Player[]) => {
          return data.map(player => {
            return new Player(
              player.id,
              player.name,
              player.lastname,
              new Date(player.birthdate),
              Number(player.height),
              Number(player.weight),
              player.club,
              player.avatar,
              Number(player.number),
              player.position,
              player.birthplace,
              player.notes
            );
          });
        })
      );
  }
}
