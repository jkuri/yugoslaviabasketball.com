import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TransferHttpCacheModule } from '@nguniversal/common';

import { AppComponent } from './app.component';
import { TeamComponent } from './components/team/team.component';
import { PlayerItemComponent } from './components/player-item/player-item.component';
import { HeaderComponent } from './components/header/header.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { PlayersService } from './shared/players.service';
import { PlayerDialogComponent } from './components/player-dialog/player-dialog.component';
import { ResizeService } from './shared/resize.service';
import { LineChartComponent } from './charts/line-chart.component';
import { PlayerInfoComponent } from './components/player-info/player-info.component';

@NgModule({
  declarations: [
    AppComponent,
    TeamComponent,
    PlayerItemComponent,
    HeaderComponent,
    SpinnerComponent,
    PlayerDialogComponent,
    LineChartComponent,
    PlayerInfoComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'yugoslaviabasketball' }),
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: 'team' },
      { path: 'team', component: TeamComponent },
      { path: 'player/:id', component: PlayerInfoComponent }
    ], { relativeLinkResolution: 'legacy' }),
    TransferHttpCacheModule,
    HttpClientModule,
    BrowserTransferStateModule
  ],
  providers: [
    PlayersService,
    ResizeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
