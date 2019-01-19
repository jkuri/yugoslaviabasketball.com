import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TransferHttpCacheModule } from '@nguniversal/common';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PlayerItemComponent } from './components/player-item/player-item.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlayerItemComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'yugoslaviabasketball.com' }),
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', component: HomeComponent }
    ]),
    TransferHttpCacheModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
