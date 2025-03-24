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

enum AmenityIconEnum {
  'Education' = 'school|#FF5733',
  'Healthcare' = 'local_hospital|#C70039',
  'Transportation' = 'train|#900C3F',
  'Food and Drink' = 'fastfood|#F19E39',
  'Shopping' = 'shopping_cart|#DAF7A6',
  'Recreation and Leisure' = 'nature_people|#581845',
  'Public Services' = 'info|#1F618D',
  'Religious' = 'church|#6C3483',
  'Accommodation' = 'hotel|#2874A6',
  'Financial Services' = 'attach_money|#239B56',
  'Utilities' = 'electrical_services|#EA33F7',
  'Other' = 'not_listed_location|#4AB7B8',
}

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
  @Input() placesUnder15: OSMElement[] = [];
  @Output() onMapCenterUpdated = new EventEmitter<L.LatLng>();
  @Output() onMapInitialized = new EventEmitter<L.Map>();

  private map: L.Map | undefined;
  private mapCenterMarker: Marker | undefined;
  private radiusCircle: Circle | undefined;

  private lightTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  });

  private darkTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors © CARTO',
    subdomains: 'abcd',
    maxZoom: 19,
  });

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
    if (changes['placesUnder15']) {
      this.updatePlaceMarkers(this.placesUnder15);
    }
  }

  updateMapCenter(lat: number, lng: number) {
    if (this.map) {
      this.mapCenterMarker?.remove();
      const center: LatLngExpression = [lat, lng];
      const centerIcon = L.divIcon({
        className: 'custom-div-icon', // Optional: Add a custom class for styling
        html: `<span class="material-icons" style="font-size: 32px; color: red;">home</span>`, // Google Icon
        iconSize: [24, 24], // Size of the icon
        iconAnchor: [12, 24], // Anchor point of the icon
      });
      this.map.panTo(center);
      // Add a marker
      this.mapCenterMarker = L.marker(center, { icon: centerIcon }).addTo(
        this.map
      );
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
            const marker = L.marker(placeMarker, {
              icon: this.setMarkerIcon(place),
            }).addTo(this.map);

            // Add popup to marker
            const placeName = place.tags?.['name'] || place.tags?.['amenity'];
            const distance =
              place.tags?.['distanceFromAddress'] || place.tags?.['amenity'];
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

  setMarkerIcon(place: OSMElement): L.DivIcon {
    const amenityType = place.tags?.[
      'amenity_type'
    ] as keyof typeof AmenityIconEnum;
    const [iconName, color] = AmenityIconEnum[amenityType]?.split('|') || [
      'place',
      'blue',
    ];
    return L.divIcon({
      className: 'custom-div-icon', // Optional: Add a custom class for styling
      html: `<span class="material-icons" style="font-size: 32px; color: ${color};">${iconName}</span>`, // Google Icon
      iconSize: [24, 24], // Size of the icon
      iconAnchor: [12, 24], // Anchor point of the icon
    });
  }

  private initMap(): void {
    // Set the initial map center and zoom level
    const initialCenter: L.LatLngExpression = [44.9778, -93.265];
    const initialZoom: number = 15;

    // Initialize the map
    this.map = L.map('map').setView(initialCenter, initialZoom);

    // Add the OpenStreetMap tile layer
    this.lightTileLayer.addTo(this.map);

    // Emit the onMapInitialized event
    this.onMapInitialized.emit(this.map);
  }

  toggleMapDarkMode(isDarkMode: boolean): void {
    if (this.map) {
      if (isDarkMode) {
        this.map.removeLayer(this.lightTileLayer);
        this.darkTileLayer.addTo(this.map);
      } else {
        this.map.removeLayer(this.darkTileLayer);
        this.lightTileLayer.addTo(this.map);
      }
    }
  }
}
