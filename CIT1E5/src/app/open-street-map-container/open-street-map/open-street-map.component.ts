import {
  Component,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import * as L from 'leaflet';
import { LatLngExpression, Marker, Circle } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { OSMElement } from '../services/overpass-state.service';

@Component({
  selector: 'open-street-map',
  templateUrl: './open-street-map.component.html',
  styleUrls: ['./open-street-map.component.scss'],
})
export class OpenStreetMapComponent {
  @Input() latitude: number = 0;
  @Input() longitude: number = 0;
  @Input() radius: number = 1200;
  @Input() showBoundaries: boolean = false;
  @Input() nearByPlaces: OSMElement[] = [];
  @Output() onMapCenterUpdated = new EventEmitter<L.LatLng>();
  @Output() onMapInitialized = new EventEmitter<L.Map>();

  private map: L.Map | undefined;
  private mapCenterMarker: Marker | undefined;
  private radiusCircle: Circle | undefined;

  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['latitude'] && changes['longitude']) {
      this.updateMapCenter(this.latitude, this.longitude);
    }
    if (changes['radius'] || changes['showBoundaries']) {
      this.updateRadiusCircle(
        this.latitude,
        this.longitude,
        this.radius,
        this.showBoundaries
      );
    }
    if (changes['nearByPlaces']) {
      this.updatePlaceMarkers(this.nearByPlaces);
    }
  }

  updateMapCenter(lat: number, lng: number) {
    if (this.map) {
      this.mapCenterMarker?.remove();
      const center: LatLngExpression = [lat, lng];
      this.map.panTo(center);
      // Add a marker
      this.mapCenterMarker = L.marker(center).addTo(this.map);
      // Emit the onMapCenterUpdated event
      this.onMapCenterUpdated.emit(this.map.getCenter());
    }
  }

  updateRadiusCircle(
    lat: number,
    lng: number,
    radius: number,
    showBoundaries: boolean
  ) {
    if (this.map) {
      if (showBoundaries) {
        this.radiusCircle?.remove();
        const center: LatLngExpression = [lat, lng];
        this.radiusCircle = L.circle(center, { radius }).addTo(this.map);
      } else {
        this.radiusCircle?.removeFrom(this.map);
      }
    }
  }

  updatePlaceMarkers(places: OSMElement[]): Marker[] {
    const markers: Marker[] = [];
    if (this.map) {
      // Clear existing markers
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Marker && layer !== this.mapCenterMarker) {
          this.map?.removeLayer(layer);
        }
      });

      // Add new markers
      places.forEach((place) => {
        if (place.lat && place.lon) {
          if (this.map) {
            const placeMarker: LatLngExpression = [place.lat, place.lon];
            const marker = L.marker(placeMarker).addTo(this.map);

            // Add popup to marker
            const placeName = place.tags?.['name'] || 'Unknown';
            const distance = place.tags?.['distanceFromAddress'] || 'Unknown';
            marker.bindPopup(
              `<b>${placeName}</b><br>Distance: ${distance} meters`
            );

            markers.push(marker);
          }
        }
      });
    }
    return markers;
  }

  private initMap(): void {
    // Set the initial map center and zoom level
    const initialCenter: L.LatLngExpression = [44.9778, -93.265];
    const initialZoom: number = 15;

    // Initialize the map
    this.map = L.map('map').setView(initialCenter, initialZoom);

    // Add the OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    // Emit the onMapInitialized event
    this.onMapInitialized.emit(this.map);
  }
}
