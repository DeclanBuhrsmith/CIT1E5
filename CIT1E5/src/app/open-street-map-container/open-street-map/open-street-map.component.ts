import { Component } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

@Component({
  selector: 'open-street-map',
  standalone: true,
  imports: [],
  templateUrl: './open-street-map.component.html',
  styleUrl: './open-street-map.component.scss',
})
export class OpenStreetMapComponent {
  private map: L.Map | undefined;

  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Set the initial map center and zoom level
    const initialCenter: L.LatLngExpression = [51.505, -0.09]; // London coordinates
    const initialZoom: number = 13;

    // Initialize the map
    this.map = L.map('map').setView(initialCenter, initialZoom);

    // Add the OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    // Add a marker (optional)
    const marker = L.marker(initialCenter).addTo(this.map);
    marker.bindPopup('Hello, this is a marker!').openPopup();
  }
}
