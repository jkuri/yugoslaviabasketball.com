import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TransferHttpCacheModule } from '@nguniversal/common';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PlayerItemComponent } from './components/player-item/player-item.component';
import { HeaderComponent } from './components/header/header.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { PlayersService } from './shared/players.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlayerItemComponent,
    HeaderComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'yugoslaviabasketball.com' }),
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', component: HomeComponent }
    ]),
    TransferHttpCacheModule,
    HttpClientModule
  ],
  providers: [
    PlayersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
