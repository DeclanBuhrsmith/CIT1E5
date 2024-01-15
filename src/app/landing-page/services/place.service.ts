import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationService } from './location.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  constructor(private locationService: LocationService) {}

  getPlaceAutocomplete(
    addresstext: any,
    currentGeoLocation: any
  ): Observable<{ address: string; centerMapOnAddress: Function }> {
    return new Observable((observer) => {
      if (!currentGeoLocation) {
        // If there's no currentGeoLocation, complete the Observable
        observer.complete();
      }

      const autocomplete = new google.maps.places.Autocomplete(
        addresstext.nativeElement
      );
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        const address = place.formatted_address || '';
        const centerMapOnAddress = () => {
          // Your logic to center the map on the address
          centerMapOnAddress() {
            // Use Google Maps API to geocode the address
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address }, (results, status) => {
              if (status === 'OK' && results) {
                const mapCenter = {
                  lat: results[0].geometry.location.lat(),
                  lng: results[0].geometry.location.lng(),
                };
              } else {
                console.error('Geocoding failed:', status);
              }
            });
          }
        };

        observer.next({ address, centerMapOnAddress });
        observer.complete();
      });
    });
  }

  getNearbyPlaces(): Observable<any> {
    // Your logic here
  }

  searchNearbyPlaces(service, typeSelection): Observable<any> {
    // Your logic here
  }

  private async getCurrentGeolocation() {
    await this.locationService.getCurrentLocation().then((location) => {
      this.currentGeoLocation = location;

      // Get the formatted address from the current location
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { location: this.currentGeoLocation },
        (results, status) => {
          if (status === 'OK' && results && results.length > 0) {
            this.address = results[0].formatted_address;
            this.centerMapOnAddress();
          } else {
            console.error('Geocoding failed:', status);
          }
        }
      );
    });
  }
}
