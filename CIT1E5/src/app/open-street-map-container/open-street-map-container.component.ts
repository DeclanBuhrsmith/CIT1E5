import { Component, effect } from '@angular/core';
import { SearchStateService } from './services/search-state.service';
import { OSMElement, OverpassService } from './services/overpass-state.service';
import { TransportationMode } from './transportation-mode/transportation-mode.component';
import { RoutingStateService } from './services/routing-state.service';
import { LatLng } from 'leaflet';

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
  map: L.Map | undefined;
  mapCenter: LatLng = new LatLng(0, 0);

  constructor(
    private searchStateService: SearchStateService,
    private overpassService: OverpassService,
    private routingService: RoutingStateService
  ) {
    // React to changes in the placesNearby signal
    effect(() => {
      // Removes chatter from the overpass api
      this.places = this.formatPlaces(this.placesNearby() || []);
    });
  }

  // Method to fetch places nearby using the Overpass API
  fetchPlacesNearby(mapCenter: LatLng): void {
    this.overpassService.setOverpassParams(
      mapCenter.lat,
      mapCenter.lng,
      this.radius
    );
  }

  // Method to handle the search event and call fetchPlacesNearby with the updated coordinates
  mapCenterUpdated(mapCenter: LatLng): void {
    this.mapCenter = mapCenter;
    this.fetchPlacesNearby(this.mapCenter);
  }

  mapInitialized(map: L.Map) {
    this.map = map;
    // this.routingService.setMap(this.map);
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
    if (this.mapCenter && this.map) {
      this.fetchPlacesNearby(this.map.getCenter());
    }
  }

  private formatPlaces(places: OSMElement[]) {
    places.filter((place) => !!place.tags?.['name']) || [];
    places.forEach((place) => {
      this.addDistanceToPlaces(place);
    });

    // TODO
    // Sort places by distanceFromAddress
    // places.sort((a, b) => {
    //   const distanceA = a.tags?.['distanceFromAddress'];
    //   const distanceB = b.tags?.['distanceFromAddress'];
    //   if (typeof distanceA === 'number' && typeof distanceB === 'number') {
    //     return distanceA - distanceB;
    //   } else {
    //     return 0;
    //   }
    // });

    return places;
  }

  private addDistanceToPlaces(place: OSMElement) {
    if (place.tags && this.map) {
      place.tags['distanceFromAddress'] = this.map
        .distance(
          this.map.getCenter(),
          new LatLng(place.lat || 0, place.lon || 0)
        )
        .toFixed(0);
    }
  }
}
