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

@Component({
  selector: 'open-street-map',
  templateUrl: './open-street-map.component.html',
  styleUrls: ['./open-street-map.component.scss'],
})
export class OpenStreetMapComponent {
  @Input() latitude: number = 0;
  @Input() longitude: number = 0;
  @Input() radius: number = 0;
  @Output() mapCenterUpdated = new EventEmitter<{ lat: number; lon: number }>();
  @Output() mapInitialized = new EventEmitter<L.Map>();

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
    if (changes['radius']) {
      this.updateRadiusCircle(this.latitude, this.longitude, this.radius);
    }
  }

  updateMapCenter(lat: number, lng: number) {
    if (this.map) {
      this.mapCenterMarker?.remove();
      const center: LatLngExpression = [lat, lng];
      this.map.panTo(center);
      // Add a marker
      this.mapCenterMarker = L.marker(center).addTo(this.map);
      // Emit the mapCenterUpdated event
      this.mapCenterUpdated.emit({ lat, lon: lng });
    }
  }

  updateRadiusCircle(lat: number, lng: number, radius: number) {
    if (this.map) {
      this.radiusCircle?.remove();
      const center: LatLngExpression = [lat, lng];
      this.radiusCircle = L.circle(center, { radius }).addTo(this.map);
    }
  }

  private initMap(): void {
    // Set the initial map center and zoom level
    const initialCenter: L.LatLngExpression = [44, -93];
    const initialZoom: number = 15;

    // Initialize the map
    this.map = L.map('map').setView(initialCenter, initialZoom);

    // Add the OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.mapCenterMarker = L.marker(initialCenter).addTo(this.map);

    // Emit the mapInitialized event
    this.mapInitialized.emit(this.map);
  }
}
