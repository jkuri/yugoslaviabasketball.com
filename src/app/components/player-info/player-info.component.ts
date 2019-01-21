import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../../shared/players.service';
import { ActivatedRoute } from '@angular/router';
import { Player } from '../../shared/player.class';
import { LineChartSettings } from '../../charts/line-chart.component';

@Component({
  selector: 'app-player-info',
  templateUrl: './player-info.component.html'
})
export class PlayerInfoComponent implements OnInit {
  fetching: boolean;
  id: number;
  player: Player;

  stats: { [key: string]: { date: any, value: number, notes?: string }[]};

  percentChartSettings: LineChartSettings = new LineChartSettings();

  constructor(
    public playersService: PlayersService,
    public activatedRoute: ActivatedRoute
  ) {
    this.percentChartSettings.yMinMax.min = 0;
    this.percentChartSettings.yMinMax.max = 100;
  }

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

        this.calculateStats(data.stats);
      }, err => console.error(err), () => this.fetching = false);
  }

  private calculateStats(data: any): void {
    this.stats = {
      'team': [],
      'ppg': [],
      'percent': [],
      'ft_percent': [],
      '3fg_percent': [],
      'rpg': [],
      'apg': [],
      'spg': [],
      'bpg': [],
      'mpg': []
    };

    Object.keys(data).forEach(key => {
      const seasonData = data[key];
      const date = new Date().setFullYear(Number(key.split('/')[0]));
      const notes = seasonData.team;

      Object.keys(seasonData).forEach(entryKey => {
        this.stats[entryKey].push({ date, value: Number(seasonData[entryKey]), notes });
      });
    });
  }

}
