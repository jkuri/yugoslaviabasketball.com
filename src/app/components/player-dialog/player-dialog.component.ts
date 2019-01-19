import { Component, OnInit, Input } from '@angular/core';
import { PlayersService } from '../../shared/players.service';

@Component({
  selector: 'app-player-dialog',
  templateUrl: './player-dialog.component.html'
})
export class PlayerDialogComponent implements OnInit {

  constructor(public playersService: PlayersService) { }

  ngOnInit() { }
}
