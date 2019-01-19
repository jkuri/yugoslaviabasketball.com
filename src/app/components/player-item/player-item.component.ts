import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../../shared/player.class';

@Component({
  selector: 'app-player-item',
  templateUrl: './player-item.component.html'
})
export class PlayerItemComponent implements OnInit {
  @Input() player: Player;

  constructor() { }

  ngOnInit() { }
}
