import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Player } from '../../shared/player.class';

@Component({
  selector: 'app-player-item',
  templateUrl: './player-item.component.html'
})
export class PlayerItemComponent implements OnInit {
  @Input() player: Player;
  @Output() info: EventEmitter<Player>;
  @Output() stats: EventEmitter<number>;

  constructor() {
    this.info = new EventEmitter<Player>();
    this.stats = new EventEmitter<number>();
  }

  ngOnInit() { }
}
