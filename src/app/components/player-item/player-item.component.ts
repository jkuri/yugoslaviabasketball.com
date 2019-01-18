import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../../shared/player.class';

@Component({
  selector: 'app-player-item',
  templateUrl: './player-item.component.html',
  styleUrls: ['./player-item.component.sass']
})
export class PlayerItemComponent implements OnInit {
  @Input() player: Player;

  constructor() { }

  ngOnInit() { }
}
