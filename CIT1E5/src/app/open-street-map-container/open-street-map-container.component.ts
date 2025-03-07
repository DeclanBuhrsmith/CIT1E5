import { Component } from '@angular/core';
import { SearchStateService } from './services/search-state.service';
import { OverpassService } from './services/overpass-state.service';

@Component({
  selector: 'open-street-map-container',
  templateUrl: './open-street-map-container.component.html',
  styleUrls: ['./open-street-map-container.component.scss'],
})
export class OpenStreetMapContainerComponent {
  // Use signals to track the state
  searchResults = this.searchStateService.nominatimResponse$;
  errorMessage = this.searchStateService.error$;
  placesNearby = this.overpassService.placesNearby$;
  overpassError = this.overpassService.error$;

  constructor(
    private searchStateService: SearchStateService,
    private overpassService: OverpassService
  ) {}

  // Method to fetch places nearby using the Overpass API
  fetchPlacesNearby(lat: number, lon: number): void {
    this.overpassService.getPlacesNearby(lat, lon);
  }

  // Method to handle the search event and call fetchPlacesNearby with the updated coordinates
  onSearchTriggered(lat: number, lon: number): void {
    this.fetchPlacesNearby(lat, lon);
  }
}
