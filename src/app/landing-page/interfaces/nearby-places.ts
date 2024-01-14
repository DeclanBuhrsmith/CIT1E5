// Purpose: Interface for nearby places.
export interface NearbyPlaces {
  name: string;
  operational: boolean;
  location: {
    lat: number;
    lng: number;
  }
  rating: number;
  types: string[];
  iconUrl: string;
  place_url: string;
  distance?: string;
  duration?: string;
  score?: number;
  categories: string[];
}
