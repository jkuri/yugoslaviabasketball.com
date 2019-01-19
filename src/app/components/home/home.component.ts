import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../../shared/players.service';
import { Player } from '../../shared/player.class';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  fetching: boolean;
  players: Player[];

  constructor(
    private playersService: PlayersService
  ) { }

  ngOnInit() {
    this.fetchPlayers();
  }

  fetchPlayers(): void {
    this.fetching = true;
    this.playersService.fetchPlayers()
      .pipe(delay(500))
      .subscribe(resp => {
        this.players = resp.map(data => {
          return new Player(
            data.name,
            data.lastname,
            new Date(data.birthdate),
            data.height,
            data.weight,
            data.club,
            data.avatar
          );
        });
      }, err => {
        // console.error(err);
      }, () => {
        this.fetching = false;
      });
    }
}
