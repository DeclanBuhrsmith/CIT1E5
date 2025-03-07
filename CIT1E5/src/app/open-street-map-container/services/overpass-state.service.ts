import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OverpassService {
  // Overpass API endpoint
  private overpassUrl = 'https://overpass-api.de/api/interpreter';

  // Use signals to manage state
  private placesNearby = signal<any[] | null>(null);
  private errorMessage = signal<string | null>(null);

  // Expose signals as read-only
  placesNearby$ = this.placesNearby.asReadonly();
  error$ = this.errorMessage.asReadonly();

  constructor(private http: HttpClient) {}

  /**
   * Fetches places near a given latitude and longitude using the Overpass API.
   * @param lat Latitude of the center point.
   * @param lng Longitude of the center point.
   * @param radius Radius in meters (default: 1000).
   */
  getPlacesNearby(lat: number, lng: number, radius: number = 1000): void {
    // Define the Overpass QL query
    const query = `
      [out:json][timeout:25];
      node["amenity"](around:${radius}, ${lat}, ${lng});
      out body;
      >;
      out skel qt;
    `;

    // Send the query as a POST request
    this.http
      .post<any[]>(this.overpassUrl, query, {
        headers: { 'Content-Type': 'text/plain' },
      })
      .subscribe({
        next: (response) => this.placesNearby.set(response),
        error: (err) => {
          this.errorMessage.set('An error occurred while fetching the data.');
          console.error(err);
        },
      });
  }
}
