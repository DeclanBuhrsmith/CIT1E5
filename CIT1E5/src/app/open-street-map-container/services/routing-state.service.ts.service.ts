import { Injectable, signal, computed } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';

@Injectable({
  providedIn: 'root',
})
export class RoutingStateService {
  // Signal to store the route distance (in meters)
  private distanceSignal = signal<number | null>(null);

  // Signal to store the route geometry (for displaying on the map)
  private routeGeometrySignal = signal<L.LatLng[] | null>(null);

  // Computed signal to get the distance in kilometers
  public distanceInKm = computed(() => {
    const distance = this.distanceSignal();
    return distance ? distance / 1000 : null;
  });

  // Computed signal to get the route geometry
  public routeGeometry = computed(() => this.routeGeometrySignal());

  constructor() {}

  /**
   * Calculates the walking route between two coordinates using Leaflet Routing Machine.
   * @param startLat Latitude of the start point.
   * @param startLng Longitude of the start point.
   * @param endLat Latitude of the end point.
   * @param endLng Longitude of the end point.
   */
  calculateWalkingRoute(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
    map: L.Map
  ): void {
    // Add a tile layer (e.g., OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Initialize the routing control
    const routingControl = L.Routing.control({
      waypoints: [L.latLng(startLat, startLng), L.latLng(endLat, endLng)],
      routeWhileDragging: true,
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1', // OSRM endpoint
        profile: 'foot', // Walking profile
      }),
    }).addTo(map);

    // Listen for the route calculation event
    routingControl.on('routesfound', (event) => {
      const routes = event.routes;
      if (routes && routes.length > 0) {
        const route = routes[0];
        this.distanceSignal.set(route.summary.totalDistance); // Set the distance signal
        this.routeGeometrySignal.set(route.coordinates); // Set the route geometry signal
      }
    });
  }

  /**
   * Resets the route data.
   */
  resetRoute(): void {
    this.distanceSignal.set(null);
    this.routeGeometrySignal.set(null);
  }
}
