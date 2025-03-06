import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { AppComponent } from './app.component';
import { OpenStreetMapContainerComponent } from './open-street-map-container/open-street-map-container.component';
import { SearchFormComponent } from './open-street-map-container/search-form/search-form.component';
import { OpenStreetMapComponent } from './open-street-map-container/open-street-map/open-street-map.component';

@NgModule({
  declarations: [
    AppComponent,
    OpenStreetMapContainerComponent,
    SearchFormComponent,
    OpenStreetMapComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule, // Add RouterModule to imports
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
