import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationService } from './location.service';

@Injectable({
  providedIn: 'root',
})
export class PlaceService {
  constructor(private locationService: LocationService) {}

  async getPlaceAutocomplete(
    currentGeoLocation: any,
    addresstext: any
  ): Promise<string | undefined> {
    if (!currentGeoLocation) {
      currentGeoLocation = await this.locationService.getCurrentLocation();
      if (!currentGeoLocation) return;
    }

    const autocomplete = new google.maps.places.Autocomplete(
      addresstext.nativeElement
    );
    return new Promise((resolve) => {
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        const address = place.formatted_address || '';
        resolve(address);
      });
    });
  }
}
