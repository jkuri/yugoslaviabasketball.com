import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Player } from './player.class';

export const RESULT_API_KEY = makeStateKey<string>('api-url');

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  url: string;
  playerDialogOpened: boolean;
  player: Player;

  constructor(
    private http: HttpClient,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.url = isPlatformServer(this.platformId) ? 'http://localhost:4444/' : '/';
  }

  openPlayerDialog(player: Player): void {
    this.player = player;
    this.playerDialogOpened = true;
  }

  closePlayerDialog(): void {
    this.playerDialogOpened = false;
    this.player = null;
  }

  fetchPlayer(id: number): Observable<any> {
    if (!this.transferState.hasKey(RESULT_API_KEY)) {
      const url = `${this.url}api/players/${id}`;
      return this.http.get<any>(url)
        .pipe(
          tap((result: any) => {
            if (isPlatformServer(this.platformId)) {
              this.transferState.set(RESULT_API_KEY, result);
            }
          })
        );
    } else {
      const result = this.transferState.get<any>(RESULT_API_KEY, null);
      this.transferState.remove(RESULT_API_KEY);
      return of(result);
    }
  }

  fetchPlayers(): Observable<Player[]> {
    if (!this.transferState.hasKey(RESULT_API_KEY)) {
      const url = this.url + 'api/players';
      return this.http.get<Player[]>(url)
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
          }),
          tap((result: any) => {
            if (isPlatformServer(this.platformId)) {
              this.transferState.set(RESULT_API_KEY, result);
            }
          })
        );
    } else {
      const result = this.transferState.get<any>(RESULT_API_KEY, null);
      this.transferState.remove(RESULT_API_KEY);
      return of(result);
    }
  }
}
