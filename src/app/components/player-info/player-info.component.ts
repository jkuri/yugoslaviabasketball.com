import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../../shared/players.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-player-info',
  templateUrl: './player-info.component.html'
})
export class PlayerInfoComponent implements OnInit {
  fetching: boolean;
  id: number;

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
        console.log(data);
      }, err => console.error(err), () => this.fetching = false);
  }

}
