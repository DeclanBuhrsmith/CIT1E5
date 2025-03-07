import { Component, Input, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { LatLngExpression, Marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';

@Component({
  selector: 'open-street-map',
  templateUrl: './open-street-map.component.html',
  styleUrls: ['./open-street-map.component.scss'],
})
export class OpenStreetMapComponent {
  @Input() latitude: number = 0;
  @Input() longitude: number = 0;

  private map: L.Map | undefined;
  private mapCenterMarker: Marker | undefined;

  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log(changes);
    if (changes['latitude'] && changes['longitude']) {
      this.updateMapCenter(this.latitude, this.longitude);
    }
  }

  updateMapCenter(lat: number, lng: number) {
    if (this.map) {
      this.mapCenterMarker?.remove();
      const center: LatLngExpression = [lat, lng];
      this.map.panTo(center);
      // Add a marker
      this.mapCenterMarker = L.marker(center).addTo(this.map);
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
  }
}
