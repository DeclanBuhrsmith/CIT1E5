import { Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, switchMap } from 'rxjs';
import { AmenityType } from '../search-form/search-preferences/search-preferences.component';

// Interface for the tags (key-value pairs) associated with an OSM element
export interface OSMTags {
  [key: string]: string | number; // Dynamic key-value pairs (e.g., "amenity": "cafe")
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

interface AmenityTypeWithSubtypes {
  amenity: string;
  types: string[];
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
    amenities: AmenityType[];
  } | null>(null);
  private placesNearby = signal<OSMElement[] | null>(null);
  private errorMessage = signal<string | null>(null);

  private amenityTypeMap: { [key in AmenityType]: string[] } = {
    [AmenityType.Other]: [
      'animal_boarding',
      'animal_breeding',
      'animal_shelter',
      'baking_oven',
      'childcare',
      'crematorium',
      'dive_centre',
      'funeral_hall',
      'grave_yard',
      'grit_bin',
      'hunting_stand',
      'internet_cafe',
      'kitchen',
      'kneipp_water_cure',
      'lounger',
      'marketplace',
      'monastery',
      'photo_booth',
      'place_of_mourning',
      'public_bath',
      'public_building',
      'refugee_site',
      'vending_machine',
      'waste_transfer_station',
      'watering_place',
      'water_point',
    ],
    [AmenityType.Education]: [
      'college',
      'kindergarten',
      'language_school',
      'library',
      'music_school',
      'school',
      'university',
      'research_institute',
    ],
    [AmenityType.Healthcare]: [
      'clinic',
      'dentist',
      'doctors',
      'hospital',
      'nursing_home',
      'pharmacy',
      'social_facility',
      'veterinary',
    ],
    [AmenityType.Transportation]: [
      'bicycle_parking',
      'bicycle_repair_station',
      'bicycle_rental',
      'boat_sharing',
      'bus_station',
      'car_rental',
      'car_sharing',
      'car_wash',
      'charging_station',
      'ferry_terminal',
      'fuel',
      'grit_bin',
      'motorcycle_parking',
      'parking',
      'parking_entrance',
      'parking_space',
      'taxi',
    ],
    [AmenityType.FoodAndDrink]: [
      'bar',
      'bbq',
      'biergarten',
      'cafe',
      'drinking_water',
      'fast_food',
      'food_court',
      'ice_cream',
      'pub',
      'restaurant',
    ],
    [AmenityType.Shopping]: [
      'marketplace',
      'supermarket',
      'convenience',
      'mall',
      'bakery',
      'butcher',
      'greengrocer',
    ],
    [AmenityType.RecreationAndLeisure]: [
      'arts_centre',
      'brothel',
      'casino',
      'cinema',
      'community_centre',
      'conference_centre',
      'events_venue',
      'fountain',
      'gambling',
      'love_hotel',
      'nightclub',
      'planetarium',
      'public_bookcase',
      'social_centre',
      'stripclub',
      'studio',
      'swingerclub',
      'theatre',
    ],
    [AmenityType.PublicServices]: [
      'courthouse',
      'embassy',
      'fire_station',
      'police',
      'post_box',
      'post_depot',
      'post_office',
      'prison',
      'ranger_station',
      'townhall',
    ],
    [AmenityType.Religious]: [
      'church',
      'mosque',
      'monastery',
      'place_of_worship',
      'shrine',
      'temple',
    ],
    [AmenityType.Accommodation]: [
      'apartment',
      'camp_site',
      'caravan_site',
      'chalet',
      'guest_house',
      'hostel',
      'hotel',
      'motel',
    ],
    [AmenityType.FinancialServices]: ['atm', 'bank', 'bureau_de_change'],
    [AmenityType.Utilities]: [
      'bench',
      'clock',
      'compressed_air',
      'dumpster',
      'emergency_phone',
      'fire_hydrant',
      'hunting_stand',
      'parcel_locker',
      'post_box',
      'recycling',
      'shelter',
      'shower',
      'telephone',
      'toilets',
      'waste_basket',
      'waste_disposal',
      'watering_place',
    ],
  };

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
            searchData.radius,
            searchData.amenities
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

  setOverpassParams(
    lat: number,
    lng: number,
    radius: number,
    amenities: AmenityType[]
  ): void {
    this.searchData.set({ lat, lng, radius, amenities });
  }

  // Method to call the Overpass API
  private fetchPlacesNearby(
    lat: number,
    lng: number,
    radius: number,
    amenities: AmenityType[]
  ) {
    // Define the Overpass QL query
    const query = `
      [out:json][timeout:25];
      node[${this.setQuery(amenities)}](around:${radius}, ${lat}, ${lng});
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

  private setQuery(amenities: AmenityType[]): string {
    let query = '"amenity"';
    if (amenities.length === Object.keys(AmenityType).length) {
      return query;
    } else {
      let subTypes = '';
      amenities.forEach((amenity: AmenityType) => {
        subTypes += this.setAmenitySubTypes(amenity);
      });
      query += `~"${subTypes}"`;
      return query;
    }
  }

  private setAmenitySubTypes(amenity: AmenityType): string {
    return this.amenityTypeMap[amenity]?.join('|') || '';
  }
}
