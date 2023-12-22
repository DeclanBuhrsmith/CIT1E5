import { Component, HostBinding, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { HttpClient } from '@angular/common/http'; // Import from @angular/common/http
import { map } from 'rxjs/operators'; // Import the map operator
import { googleMapsTypes } from './interfaces/google-maps-types';
import { nearbyPlaces } from './interfaces/nearby-places';

@Component({
  selector: 'landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  @HostBinding('class') className = '';
  @ViewChild('gmap') gmap: GoogleMap | undefined;
  @ViewChild('addressInput') addresstext: any;

  toggleControl = new FormControl(false);
  address: string = '';
  mapOptions: google.maps.MapOptions;
  markerOptions: google.maps.MarkerOptions;
  mapCenter: google.maps.LatLngLiteral = { lat: 45, lng: -93.19333 };

  apiKey = 'AIzaSyBb6q-ATX9Ih6LkWjYrmuzWwMWpY3Mr2UQ';

  // Google Objects
  googleMapsForm: FormGroup;
  googleMapsTypesStrings: string[] = [
    'accounting',
    'airport',
    'amusement_park',
    'aquarium',
    'art_gallery',
    'atm',
    'bakery',
    'bank',
    'bar',
    'beauty_salon',
    'bicycle_store',
    'book_store',
    'bowling_alley',
    'bus_station',
    'cafe',
    'campground',
    'car_dealer',
    'car_rental',
    'car_repair',
    'car_wash',
    'casino',
    'cemetery',
    'church',
    'city_hall',
    'clothing_store',
    'convenience_store',
    'courthouse',
    'dentist',
    'department_store',
    'doctor',
    'drugstore',
    'electrician',
    'electronics_store',
    'embassy',
    'fire_station',
    'florist',
    'funeral_home',
    'furniture_store',
    'gas_station',
    'gym',
    'hair_care',
    'hardware_store',
    'hindu_temple',
    'home_goods_store',
    'hospital',
    'insurance_agency',
    'jewelry_store',
    'laundry',
    'lawyer',
    'library',
    'light_rail_station',
    'liquor_store',
    'local_government_office',
    'locksmith',
    'lodging',
    'meal_delivery',
    'meal_takeaway',
    'mosque',
    'movie_rental',
    'movie_theater',
    'moving_company',
    'museum',
    'night_club',
    'painter',
    'park',
    'parking',
    'pet_store',
    'pharmacy',
    'physiotherapist',
    'plumber',
    'police',
    'post_office',
    'primary_school',
    'real_estate_agency',
    'restaurant',
    'roofing_contractor',
    'rv_park',
    'school',
    'secondary_school',
    'shoe_store',
    'shopping_mall',
    'spa',
    'stadium',
    'storage',
    'store',
    'subway_station',
    'supermarket',
    'synagogue',
    'taxi_stand',
    'tourist_attraction',
    'train_station',
    'transit_station',
    'travel_agency',
    'university',
    'veterinary_care',
    'zoo',
  ];
  nearbyPlaces: google.maps.places.PlaceResult[] | null = [];

  checkbox = false;
  selectedTypes: string[] = [];

  // Specific interfaces
  googleMapsTypes: googleMapsTypes[] = [];
  parsedNearbyPlaces: nearbyPlaces[] = [];

  constructor(private fb: FormBuilder) {
    this.mapOptions = {
      zoom: 15,
    };

    this.markerOptions = {
      draggable: false,
    };

    this.googleMapsForm = this.fb.group({
      mapTypes: [this.googleMapsTypes], // Use an array to store the selected checkboxes
    });
  }

  ngOnInit() {
    this.googleMapsTypes = this.googleMapsTypesStrings.map((type) => {
      return {
        type: type,
        selected: false,
      };
    });
  }

  search(addressFromAutoComplete?: string) {
    this.address = addressFromAutoComplete || this.address;
    console.log('Search Address:', this.address);

    // Use Google Maps API to geocode the address
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: this.address }, (results, status) => {
      if (status === 'OK' && results) {
        this.mapCenter = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
      } else {
        console.error('Geocoding failed:', status);
      }
    });
    this.getNearbyPlaces();
  }

  updateAddress(address: string) {
    this.address = address;
  }

  getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(
      this.addresstext.nativeElement
    );
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.search(place.formatted_address);
    });
  }

  getNearbyPlaces() {
    if (this.gmap?.googleMap) {
      const service = new google.maps.places.PlacesService(this.gmap.googleMap);

      // TODO depending on the checkbox, add the type to the request

      service.nearbySearch(
        {
          location: this.mapCenter,
          radius: 1000,
          type: 'restaurant',
        },
        (results, status) => {
          if (status === 'OK') {
            console.log('Nearby Places:', results);
            this.nearbyPlaces = results;
            if (this.nearbyPlaces && this.nearbyPlaces.length > 0) {
              this.convertNearbyPlacesParsedObject(this.nearbyPlaces);
            }
          }
        }
      );
    }
  }

  private convertNearbyPlacesParsedObject(
    results: google.maps.places.PlaceResult[]
  ) {
    // Object will look like this.
    //   {
    //     "name": "Nicollet Island Inn",
    //     "operational": true,
    //     "location": {
    //         "lng": -93.2605342,
    //         "lat": 44.9858771
    //     },
    //     "rating": 4.6,
    //     "types": [
    //         "restaurant",
    //         "night_club",
    //         "bar",
    //         "lodging",
    //         "food",
    //         "point_of_interest",
    //         "establishment"
    //     ],
    //     "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png"
    // }
    this.parsedNearbyPlaces = results.map((result) => {
      return {
        name: result.name || '',
        operational: result.business_status === 'OPERATIONAL',
        location: {
          lng: result.geometry?.location?.lng() || 0,
          lat: result.geometry?.location?.lat() || 0,
        },
        rating: result.rating || 0,
        types: result.types || [],
        iconUrl: result.icon || '',
      };
    });
    console.log(this.parsedNearbyPlaces);
    //this.setPlaceMarkers();
    this.calculateDistanceFromNearbyPlacesToMapCenter();
  }

  private setPlaceMarkers() {
    this.parsedNearbyPlaces.forEach((place) => {
      if (this.gmap?.googleMap) {
        const icon = {
          url: place.iconUrl,
          scaledSize: new google.maps.Size(25, 25),
        };
        const marker = new google.maps.Marker({
          position: place.location,
          map: this.gmap?.googleMap,
          title: place.name,
          icon,
        });
        marker.addListener('click', () => {

        });
        marker.setMap(this.gmap.googleMap);
      }
    });
  }

  private calculateDistanceFromNearbyPlacesToMapCenter() {
    this.parsedNearbyPlaces.forEach((place) => {
      new google.maps.DirectionsService()
      .route({
        origin: this.mapCenter,
        destination: place.location,
        travelMode: google.maps.TravelMode.BICYCLING,
      })
      .then((response) => {
        console.log(response.routes[0]?.legs[0]?.distance?.text);
        console.log(response.routes[0]?.legs[0]?.duration?.text);

        // This draws the route on the map for how to get there.
        // const renderer = new google.maps.DirectionsRenderer();
        // renderer.setDirections(response);
        // if (this.gmap?.googleMap) {
        //   renderer.setMap(this.gmap.googleMap);
        // }
      });
    });

  }
}
