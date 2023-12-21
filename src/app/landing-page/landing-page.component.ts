import { Component, HostBinding, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { HttpClient } from '@angular/common/http'; // Import from @angular/common/http
import { map } from 'rxjs/operators'; // Import the map operator


@Component({
  selector: 'landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  @HostBinding('class') className = '';
  //@ViewChild('map') map: GoogleMap | undefined;

  toggleControl = new FormControl(false);
  address: string = '';
  mapOptions: google.maps.MapOptions;
  markerOptions: google.maps.MarkerOptions;
  mapCenter: google.maps.LatLngLiteral = { lat: 40, lng: -100 };
  nearbyPlaces: any[] = []; // Store the nearby places

  apiKey = 'AIzaSyBb6q-ATX9Ih6LkWjYrmuzWwMWpY3Mr2UQ';

  constructor(private http: HttpClient) {
    this.mapOptions = {
      zoom: 15,
    };

    this.markerOptions = {
      draggable: false,
    };
  }

  search() {
    console.log('Search Address:', this.address);

    // Use Google Maps API to geocode the address
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: this.address }, (results, status) => {
      if (status === 'OK' && results) {
        this.mapCenter = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };

        // Perform a nearby search using Google Places API
        const radius = 1000;
        const location = `${this.mapCenter.lat},${this.mapCenter.lng}`;
        const types = 'restaurant';

        const placesApiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&types=${types}&key=${this.apiKey}`;

        // Use HttpClient and pipe the map operator
        this.http.get(placesApiUrl).pipe(
          map((data: any) => data.results)
        ).subscribe((data) => {
          this.nearbyPlaces = data;
          console.log('Nearby Places:', this.nearbyPlaces);
        });
      } else {
        console.error('Geocoding failed:', status);
      }
    });
  }

  updateAddress(address: string) {
    this.address = address;
  }
}
