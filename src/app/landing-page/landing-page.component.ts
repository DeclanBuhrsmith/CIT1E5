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
  @ViewChild('addressInput') addresstext: any;


  toggleControl = new FormControl(false);
  address: string = '';
  mapOptions: google.maps.MapOptions;
  markerOptions: google.maps.MarkerOptions;
  mapCenter: google.maps.LatLngLiteral = { lat: 40, lng: -100 };

  apiKey = 'AIzaSyBb6q-ATX9Ih6LkWjYrmuzWwMWpY3Mr2UQ';

  constructor() {
    this.mapOptions = {
      zoom: 15,
    };

    this.markerOptions = {
      draggable: false,
    };
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
  }

  updateAddress(address: string) {
    this.address = address;
  }

  getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement);
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        this.search(place.formatted_address)
  });
}
}
