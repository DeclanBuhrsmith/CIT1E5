import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { AppComponent } from './app.component';
import { OpenStreetMapContainerComponent } from './open-street-map-container/open-street-map-container.component';
import { SearchFormComponent } from './open-street-map-container/search-form/search-form.component';
import { OpenStreetMapComponent } from './open-street-map-container/open-street-map/open-street-map.component';
import { SearchPreferencesComponent } from './open-street-map-container/search-form/search-preferences/search-preferences.component';
import { ScoreComponent } from './open-street-map-container/score/score.component';
import { SearchResultsComponent } from './open-street-map-container/search-results/search-results.component';

@NgModule({
  declarations: [
    AppComponent,
    OpenStreetMapContainerComponent,
    SearchFormComponent,
    OpenStreetMapComponent,
    SearchPreferencesComponent,
    SearchResultsComponent,
    ScoreComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
