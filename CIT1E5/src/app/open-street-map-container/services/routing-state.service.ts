import { Injectable, signal, computed } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import { TransportationMode } from '../transportation-mode/transportation-mode.component';

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

  private map: L.Map | undefined;

  constructor() {}

  /**
   * Sets the map instance to be used by the routing service.
   * @param map The Leaflet map instance.
   */
  setMap(map: L.Map): void {
    this.map = map;
  }

  /**
   * Calculates the distance and duration between two coordinates using Leaflet Routing Machine.
   * @param startLat Latitude of the start point.
   * @param startLng Longitude of the start point.
   * @param endLat Latitude of the end point.
   * @param endLng Longitude of the end point.
   * @param mode Transportation mode (walking, biking, driving, transit).
   */
  calculateDistanceAndDuration(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
    mode: TransportationMode
  ): void {
    if (!this.map) {
      throw new Error('Map instance is not set.');
    }

    // Determine the profile based on the transportation mode
    let profile: string;
    switch (mode) {
      case TransportationMode.Bike:
        profile = 'bike';
        break;
      case TransportationMode.Drive:
        profile = 'car';
        break;
      case TransportationMode.Transit:
        profile = 'transit';
        break;
      case TransportationMode.Walk:
      default:
        profile = 'foot';
        break;
    }

    // Initialize the routing control
    const routingControl = L.Routing.control({
      waypoints: [L.latLng(startLat, startLng), L.latLng(endLat, endLng)],
      routeWhileDragging: true,
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1', // OSRM endpoint
        profile: profile, // Profile based on transportation mode
      }),
    });

    // Listen for the route calculation event
    routingControl.on('routesfound', (event) => {
      const routes = event.routes;
      if (routes && routes.length > 0) {
        const route = routes[0];
        this.distanceSignal.set(route.summary.totalDistance); // Set the distance signal
        this.routeGeometrySignal.set(route.coordinates); // Set the route geometry signal
      }
    });

    routingControl.route();
  }

  /**
   * Adds the calculated route to the map.
   * @param map The Leaflet map instance.
   */
  addRouteToMap(map: L.Map): void {
    const routeGeometry = this.routeGeometrySignal();
    if (routeGeometry) {
      L.polyline(routeGeometry).addTo(map);
    }
  }

  /**
   * Resets the route data.
   */
  resetRoute(): void {
    this.distanceSignal.set(null);
    this.routeGeometrySignal.set(null);
  }
}
