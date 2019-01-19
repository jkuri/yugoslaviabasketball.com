import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../../shared/players.service';
import { Player } from '../../shared/player.class';

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
    private playersService: PlayersService
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

      if (typeof a[key] === 'string' && typeof b[key] === 'string') {
        const comparison = a[key].localeCompare(b[key]);

        return (
          (order === 'desc') ? (comparison * -1) : comparison
        );
      } else {
        return order === 'asc' ? a - b : b - a;
      }
    };
  }
}
