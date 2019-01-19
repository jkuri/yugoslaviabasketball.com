import { Component, OnInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { PlayersService } from '../../shared/players.service';
import { Player } from '../../shared/player.class';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  fetching: boolean;
  players: Player[] = [];
  order: 'asc' | 'desc' = 'asc';
  key = 'lastname';

  constructor(
    public playersService: PlayersService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    this.fetchPlayers();
  }

  sortPlayers(key: string): void {
    if (!this.players.length) {
      return;
    }

    if (this.key === key) {
      this.order = this.order === 'asc' ? 'desc' : 'asc';
    } else {
      this.key = key;
    }

    this.players.sort(this.compareValues(this.key, this.order));
  }

  private fetchPlayers(): void {
    this.fetching = true;
    this.playersService.fetchPlayers()
      .subscribe(resp => {
        this.players = resp;
        this.sortPlayers(this.key);
      }, err => {
        console.error(err);
      }, () => {
        this.fetching = false;
      });
  }

  private compareValues(key: string, order = 'asc') {
    return (a: any, b: any) => {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0;
      }

      if (typeof a[key] === 'number' && typeof b[key] === 'number') {
        return order === 'asc' ? a[key] - b[key] : b[key] - a[key];
      } else if (typeof a[key] === 'string' && typeof b[key] === 'string') {
        const comparison = a[key].localeCompare(b[key]);

        return (
          (order === 'desc') ? (comparison * -1) : comparison
        );
      } else if (a[key] instanceof Date && b[key] instanceof Date) {
        if (order === 'asc') {
          if (a[key] > b[key]) {
            return 1;
          }
          if (a[key] < b[key]) {
            return -1;
          }
          return 0;
        } else {
          if (a[key] > b[key]) {
            return -1;
          }
          if (a[key] < b[key]) {
            return 1;
          }
          return 0;
        }
      }
    };
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    if (this.playersService.playerDialogOpened) {
      this.playersService.closePlayerDialog();
    }
  }
}
