// Purpose: Interface for nearby places.
export interface nearbyPlaces {
  name: string;
  operational: boolean;
  location: {
    lat: number;
    lng: number;
  }
  rating: number;
  types: string[];
  iconUrl: string;
}
