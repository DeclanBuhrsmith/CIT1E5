import { Component, effect } from '@angular/core';
import { SearchStateService } from './services/search-state.service';
import { OSMElement, OverpassService } from './services/overpass-state.service';
import { TransportationMode } from './transportation-mode/transportation-mode.component';

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
  // Vars
  currentTransportationMode: TransportationMode = TransportationMode.Walk;
  places: OSMElement[] = [];
  radius: number = 0;

  constructor(
    private searchStateService: SearchStateService,
    private overpassService: OverpassService
  ) {
    // React to changes in the placesNearby signal
    effect(() => {
      // Removes chatter from the overpass api
      this.places =
        this.placesNearby()?.filter((place) => !!place.tags?.['name']) || [];
    });
  }

  // Method to fetch places nearby using the Overpass API
  fetchPlacesNearby(lat: number, lon: number): void {
    this.overpassService.setOverpassParams(lat, lon, this.radius);
  }

  // Method to handle the search event and call fetchPlacesNearby with the updated coordinates
  mapCenterUpdated(lat: number, lon: number): void {
    this.fetchPlacesNearby(lat, lon);
  }

  transportationModeUpdated(transportationMode: TransportationMode) {
    this.currentTransportationMode = transportationMode;
    switch (this.currentTransportationMode) {
      case TransportationMode.Walk:
        this.radius = 1200;
        break;
      case TransportationMode.Bike:
        this.radius = 3000;
        break;
      default:
        // Both Transit and Diving have the same max distance raidus
        this.radius = 5000;
        break;
    }
    // When transportation mode is changed the radius is changed so the nearby results need to be updated
    if (this.searchResults() && this.searchResults()![0]) {
      this.fetchPlacesNearby(
        this.searchResults()![0].lat,
        this.searchResults()![0].lon
      );
    }
  }
}
