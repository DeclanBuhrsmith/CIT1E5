import { Component, effect } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { SearchStateService } from './services/search-state.service';
import { OSMElement, OverpassService } from './services/overpass-state.service';
import { RoutingStateService } from './services/routing-state.service';
import { LatLng } from 'leaflet';
import {
  AmenityType,
  TransportationMode,
} from './search-form/search-preferences/search-preferences.component';

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
  radius: number = 1200;
  map: L.Map | undefined;
  mapCenter: LatLng = new LatLng(0, 0);
  currentAmenities: AmenityType[] = [];
  showBoundaries: boolean = false;
  speed$ = new BehaviorSubject<number>(this.currentTransportationMode === TransportationMode.Walk ? 5 / 2 : 5 * 2);
  placesUnder15: OSMElement[] = [];

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

    // Convert Signal to Observable
    const placesNearby$ = toObservable(this.placesNearby);

    // Reactively update duration when speed or places change
    combineLatest([this.speed$, placesNearby$]).subscribe(([speed, places]) => {
      this.updateDuration(speed, places || []);
      this.placesUnder15 = this.showPlaces15MinutesOrLessAway(places || []);
    });
  }

  // Method to fetch places nearby using the Overpass API
  fetchPlacesNearby(mapCenter: LatLng, amenities: AmenityType[]): void {
    // if (this.searchResults() && this.searchResults()!.length)
    this.overpassService.setOverpassParams(
      mapCenter.lat,
      mapCenter.lng,
      this.radius,
      amenities
    );
  }

  onFetchPlaces() {
    this.fetchPlacesNearby(this.mapCenter, this.currentAmenities);
  }

  // Method to handle the search event and call fetchPlacesNearby with the updated coordinates
  onMapCenterUpdated(mapCenter: LatLng): void {
    this.mapCenter = mapCenter;
  }

  onMapInitialized(map: L.Map) {
    this.map = map;
  }

  onTransportationModeUpdated(transportationMode: TransportationMode) {
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
    // Trigger speed change to update durations
    this.onSpeedChange(this.speed$.value);
  }

  onAmenitiesUpdated(amenities: AmenityType[]) {
    this.currentAmenities = amenities;
  }

  onToggleBoundaries(show: boolean): void {
    this.showBoundaries = show;
  }

  onSpeedChange(speed: number) {
    this.speed$.next(speed);
  }

  private formatPlaces(places: OSMElement[]) {
    places.filter((place) => !!place.tags?.['name']) || [];
    places.forEach((place) => {
      this.addDistanceToPlace(place);
      this.addCategoryToPlace(place);
    });

    // Sort places by distanceFromAddress in ascending order
    places.sort((a, b) => {
      const distanceA = Number(a.tags?.['distanceFromAddress']);
      const distanceB = Number(b.tags?.['distanceFromAddress']);
      return distanceA - distanceB;
    });

    return places;
  }

  private addDistanceToPlace(place: OSMElement) {
    if (place.tags && this.map) {
      place.tags['distanceFromAddress'] = this.map
        .distance(
          this.map.getCenter(),
          new LatLng(place.lat || 0, place.lon || 0)
        )
        .toFixed(0);
    }
  }

  private updateDuration(speed: number, places: OSMElement[]) {
    const speedInMetersPerSecond = (speed * 1000) / 3600;
    places.forEach((place) => {
      const distanceInMeters = Number(place.tags?.['distanceFromAddress']);
      if (!isNaN(distanceInMeters)) {
        const durationInSeconds = distanceInMeters / speedInMetersPerSecond;
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = Math.floor(durationInSeconds % 60);
        if (place.tags) {
          place.tags['duration'] = `${minutes} min ${seconds} sec`;
          place.tags['durationInSeconds'] = durationInSeconds.toFixed(0);
        }
      }
    });
  }

  private addCategoryToPlace(place: OSMElement) {
    if (place.tags && place.tags['amenity']) {
      for (const [amenityType, amenities] of Object.entries(
        this.overpassService.amenityTypeMap
      )) {
        if (amenities.includes(place.tags['amenity'].toString())) {
          place.tags['amenity_type'] = amenityType;
          break;
        }
      }
    }
  }

  private showPlaces15MinutesOrLessAway(places: OSMElement[]): OSMElement[] {
    return places.filter((place) => {
      if (place.tags) {
        const durationInSeconds = Number(place.tags['durationInSeconds']);
        return !isNaN(durationInSeconds) && durationInSeconds <= (15 * 60);
      }
      return false;
    });
  }
}
