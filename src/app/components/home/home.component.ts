import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../../shared/players.service';
import { Player } from '../../shared/player.class';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  players$: Observable<Player[]>;

  constructor(
    private playersService: PlayersService
  ) { }

  ngOnInit() {
    this.fetchPlayers();
  }

  fetchPlayers(): void {
    this.players$ = this.playersService.fetchPlayers();
  }
}
