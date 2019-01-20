import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../../shared/players.service';
import { ActivatedRoute } from '@angular/router';
import { Player } from '../../shared/player.class';

@Component({
  selector: 'app-player-info',
  templateUrl: './player-info.component.html'
})
export class PlayerInfoComponent implements OnInit {
  fetching: boolean;
  id: number;
  player: Player;

  constructor(
    public playersService: PlayersService,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params.id;
    this.fetchPlayer();
  }

  fetchPlayer(): void {
    this.fetching = true;
    this.playersService.fetchPlayer(this.id)
      .subscribe(data => {
        const player = data.info;
        this.player = new Player(
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

        console.log(data);
      }, err => console.error(err), () => this.fetching = false);
  }

}
