import { Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, switchMap } from 'rxjs';

// Interface for the tags (key-value pairs) associated with an OSM element
export interface OSMTags {
  [key: string]: string; // Dynamic key-value pairs (e.g., "amenity": "cafe")
}

// Interface for a single OSM element (node, way, or relation)
export interface OSMElement {
  type: 'node' | 'way' | 'relation'; // Type of OSM element
  id: number; // Unique ID of the element
  lat?: number; // Latitude (only for nodes)
  lon?: number; // Longitude (only for nodes)
  nodes?: number[]; // List of node IDs (only for ways)
  tags?: OSMTags; // Tags associated with the element
}

// Interface for the metadata in the Overpass response
export interface OSM3S {
  timestamp_osm_base: string; // Timestamp of the data
  copyright: string; // Copyright information
}

// Interface for the full Overpass API response
export interface OverpassResponse {
  version: number; // API version
  generator: string; // Generator of the response (e.g., "Overpass API")
  osm3s: OSM3S; // Metadata
  elements: OSMElement[]; // List of OSM elements
}

@Injectable({
  providedIn: 'root',
})
export class OverpassService {
  // Overpass API endpoint
  private overpassUrl = 'https://overpass-api.de/api/interpreter';

  // Use signals to manage state
  private searchData = signal<{
    lat: number;
    lng: number;
    radius: number;
  } | null>(null);
  private placesNearby = signal<OSMElement[] | null>(null);
  private errorMessage = signal<string | null>(null);

  // Expose signals as read-only
  searchData$ = this.searchData.asReadonly();
  placesNearby$ = this.placesNearby.asReadonly();
  error$ = this.errorMessage.asReadonly();

  constructor(private http: HttpClient) {
    // React to changes in searchData and call the Overpass API
    effect(
      () => {
        const searchData = this.searchData();
        if (searchData) {
          this.fetchPlacesNearby(
            searchData.lat,
            searchData.lng,
            searchData.radius
          ).subscribe({
            next: (response) =>
              this.placesNearby.set(response ? response.elements : []),
            error: (err) => {
              this.errorMessage.set(
                'An error occurred while fetching the data.'
              );
              console.error(err);
            },
          });
        } else {
          this.placesNearby.set(null);
        }
      },
      { allowSignalWrites: true }
    );
  }

  setSearchData(lat: number, lng: number, radius: number = 1000): void {
    this.searchData.set({ lat, lng, radius });
  }

  // Method to call the Overpass API
  private fetchPlacesNearby(lat: number, lng: number, radius: number) {
    // Define the Overpass QL query
    const query = `
      [out:json][timeout:25];
      node["amenity"](around:${radius}, ${lat}, ${lng});
      out body;
      >;
      out skel qt;
    `;

    // Send the query as a POST request
    return this.http
      .post<OverpassResponse>(this.overpassUrl, query, {
        headers: { 'Content-Type': 'text/plain' },
      })
      .pipe(
        catchError((error) => {
          this.errorMessage.set('An error occurred while fetching the data.');
          console.error(error);
          return of(null);
        })
      );
  }
}
