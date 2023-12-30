import {
  AfterViewInit,
  Component,
  HostBinding,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { TypesSelection } from './interfaces/types-selection';
import { NearbyPlaces } from './interfaces/nearby-places';
import { TravelModeEnum } from './enums/travel-modes';
import {
  Automotive,
  Education,
  EntertainmentAndRecreation,
  FinancialServices,
  FoodAndBeverage,
  HealthAndWellness,
  HomeAndGarden,
  PublicServicesAndGovernment,
  ReligiousPlaces,
  RetailStores,
  TravelAndLodging,
} from './enums/types';

@Component({
  selector: 'landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
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
  //googleMapsForm: FormGroup;
  nearbyPlaces: google.maps.places.PlaceResult[] | null = [];
  travelModes = Object.values(TravelModeEnum);
  selectedTravelMode = TravelModeEnum.WALKING;

  checkbox = false;
  selectedTypes: string[] = [];

  // Specific interfaces
  typesSelection: TypesSelection[] = [];
  parsedNearbyPlaces: NearbyPlaces[] = [];

  //TypesSelection
  financialServicesChecked = false;
  foodAndBeverageChecked = false;
  retailStoresChecked = false;
  healthAndWellnessChecked = false;
  automotiveChecked = false;
  publicServicesAndGovernmentChecked = false;
  educationChecked = false;
  entertainmentChecked = false;
  lodgingChecked = false;
  travelAndTourismChecked = false;
  homeAndGardenChecked = false;
  religiousPlacesChecked = false;
  financialServicesTypeSelection: TypesSelection[] = [];
  foodAndBeverageTypeSelection: TypesSelection[] = [];
  retailStoresTypeSelection: TypesSelection[] = [];
  healthAndWellnessTypeSelection: TypesSelection[] = [];
  automotiveTypeSelection: TypesSelection[] = [];
  publicServicesAndGovernmentTypeSelection: TypesSelection[] = [];
  educationTypeSelection: TypesSelection[] = [];
  entertainmentTypeSelection: TypesSelection[] = [];
  travelAndTourismTypeSelection: TypesSelection[] = [];
  homeAndGardenTypeSelection: TypesSelection[] = [];
  religiousPlacesTypeSelection: TypesSelection[] = [];

  constructor(private fb: FormBuilder) {
    this.mapOptions = {
      zoom: 15,
    };

    this.markerOptions = {
      draggable: false,
    };

    // this.googleMapsForm = this.fb.group({
    //   mapTypes: [this.typesSelection], // Use an array to store the selected checkboxes
    // });
  }

  ngOnInit() {
    this.initializeTypesSelection();
  }

  centerMapOnAddress() {
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

  getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(
      this.addresstext.nativeElement
    );
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.address = place.formatted_address || '';
      this.centerMapOnAddress();
    });
  }

  async getNearbyPlaces() {
    // Clear the previous results
    this.parsedNearbyPlaces = [];
    this.nearbyPlaces = [];

    if (this.gmap?.googleMap) {
      const service = new google.maps.places.PlacesService(this.gmap.googleMap);

      // // TODO depending on the checkbox, add the type to the request
      if (this.financialServicesChecked) {
        await this.searchNearbyPlaces(
          service,
          this.financialServicesTypeSelection
        );
      }

      if (this.foodAndBeverageChecked) {
        await this.searchNearbyPlaces(
          service,
          this.foodAndBeverageTypeSelection
        );
      }

      if (this.retailStoresChecked) {
        await this.searchNearbyPlaces(service, this.retailStoresTypeSelection);
      }

      if (this.healthAndWellnessChecked) {
        await this.searchNearbyPlaces(
          service,
          this.healthAndWellnessTypeSelection
        );
      }

      if (this.automotiveChecked) {
        await this.searchNearbyPlaces(service, this.automotiveTypeSelection);
      }

      if (this.publicServicesAndGovernmentChecked) {
        await this.searchNearbyPlaces(
          service,
          this.publicServicesAndGovernmentTypeSelection
        );
      }

      if (this.educationChecked) {
        await this.searchNearbyPlaces(service, this.educationTypeSelection);
      }

      if (this.entertainmentChecked) {
        await this.searchNearbyPlaces(service, this.entertainmentTypeSelection);
      }

      if (this.travelAndTourismChecked) {
        await this.searchNearbyPlaces(
          service,
          this.travelAndTourismTypeSelection
        );
      }

      if (this.homeAndGardenChecked) {
        await this.searchNearbyPlaces(service, this.homeAndGardenTypeSelection);
      }

      if (this.religiousPlacesChecked) {
        await this.searchNearbyPlaces(
          service,
          this.religiousPlacesTypeSelection
        );
      }
    }
    if (this.nearbyPlaces && this.nearbyPlaces.length > 0) {
      this.nearbyPlaces = this.nearbyPlaces.filter(
        (place, index, self) =>
          index === self.findIndex((t) => t.place_id === place.place_id)
      );
      this.convertNearbyPlacesParsedObject(this.nearbyPlaces);
    }
  }

  renderRoute(response: any) {
    const renderer = new google.maps.DirectionsRenderer();
    if (this.gmap?.googleMap) {
      renderer.setDirections(response);
      renderer.setMap(this.gmap.googleMap);
    }
  }

  toggleAllFinancialServices(event: any) {
    this.financialServicesChecked = event.checked;
    this.toggleAllTypes(event, this.financialServicesTypeSelection);
  }

  toggleAllFoodAndBeverage(event: any) {
    this.foodAndBeverageChecked = event.checked;
    this.toggleAllTypes(event, this.foodAndBeverageTypeSelection);
  }

  toggleAllRetailStores(event: any) {
    this.retailStoresChecked = event.checked;
    this.toggleAllTypes(event, this.retailStoresTypeSelection);
  }

  toggleAllHealthAndWellness(event: any) {
    this.healthAndWellnessChecked = event.checked;
    this.toggleAllTypes(event, this.healthAndWellnessTypeSelection);
  }

  toggleAllAutomotive(event: any) {
    this.automotiveChecked = event.checked;
    this.toggleAllTypes(event, this.automotiveTypeSelection);
  }

  toggleAllPublicServicesAndGovernment(event: any) {
    this.publicServicesAndGovernmentChecked = event.checked;
    this.toggleAllTypes(event, this.publicServicesAndGovernmentTypeSelection);
  }

  toggleAllEducation(event: any) {
    this.educationChecked = event.checked;
    this.toggleAllTypes(event, this.educationTypeSelection);
  }

  toggleAllEntertainment(event: any) {
    this.entertainmentChecked = event.checked;
    this.toggleAllTypes(event, this.entertainmentTypeSelection);
  }

  toggleAllTravelAndTourism(event: any) {
    this.travelAndTourismChecked = event.checked;
    this.toggleAllTypes(event, this.travelAndTourismTypeSelection);
  }

  toggleAllHomeAndGarden(event: any) {
    this.homeAndGardenChecked = event.checked;
    this.toggleAllTypes(event, this.homeAndGardenTypeSelection);
  }

  toggleAllReligiousPlaces(event: any) {
    this.religiousPlacesChecked = event.checked;
    this.toggleAllTypes(event, this.religiousPlacesTypeSelection);
  }

  indeterminate(parentCheckbox: boolean, typeSelection: TypesSelection[]) {
    return parentCheckbox && typeSelection.some((type) => !type.selected);
  }

  areAllCheckboxesUnchecked(): boolean {
    const allSelections = [
      this.financialServicesTypeSelection,
      this.foodAndBeverageTypeSelection,
      this.retailStoresTypeSelection,
      this.healthAndWellnessTypeSelection,
      this.automotiveTypeSelection,
      this.publicServicesAndGovernmentTypeSelection,
      this.educationTypeSelection,
      this.travelAndTourismTypeSelection,
      this.entertainmentTypeSelection,
      this.homeAndGardenTypeSelection,
      this.religiousPlacesTypeSelection,
    ];

    for (let selection of allSelections) {
      if (selection.some((type) => type.selected)) {
        return false;
      }
    }

    return true;
  }

  getScore(): number {
    let score = 0;
    const weight = this.getWeightByTravelMode(this.selectedTravelMode);

    this.parsedNearbyPlaces.forEach((place) => {
      if (place.duration) {
        score = score + ((1 - this.extractNumber(place.duration) / 15) * weight);
      }
    });

    return score;
  }

  private getWeightByTravelMode(travelMode: TravelModeEnum): number {
    switch (travelMode) {
      case TravelModeEnum.WALKING:
        return 1;
      case TravelModeEnum.BICYCLING:
        return 0.75;
      case TravelModeEnum.TRANSIT:
        return 0.5;
      default:
        return 0.25;
    }
  }

  private searchNearbyPlaces(
    service: google.maps.places.PlacesService,
    typeSelection: TypesSelection[]
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const promises: Promise<void>[] = [];

      typeSelection.forEach((type) => {
        if (type.selected) {
          const promise = new Promise<void>((resolveType) => {
            service.nearbySearch(
              {
                location: this.mapCenter,
                radius: 1000,
                type: type.type,
              },
              (results, status) => {
                if (status === 'OK') {
                  if (results !== null) {
                    results.forEach((result) => {
                      this.nearbyPlaces?.push(result);
                    });
                  }
                  resolveType();
                } else {
                  console.warn(
                    `Nearby search failed on type: ${type.type}`,
                    status
                  );
                  resolveType();
                }
              }
            );
          });

          promises.push(promise);
        }
      });

      Promise.all(promises)
        .then(() => resolve())
        .catch((error) => reject(error));
    });
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
    console.log('Nearby Places:', results);
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
        place_url: result.place_id
          ? `https://www.google.com/maps/place/?q=place_id:${result.place_id}`
          : '',
      };
    });
  }

  private initializeTypesSelection() {
    const initializeSelection = (
      values: string[],
      selection: TypesSelection[]
    ) => {
      values.forEach((value) => {
        selection.push({
          type: value,
          selected: false,
        });
      });
    };

    initializeSelection(
      Object.values(FinancialServices),
      this.financialServicesTypeSelection
    );
    initializeSelection(
      Object.values(FoodAndBeverage),
      this.foodAndBeverageTypeSelection
    );
    initializeSelection(
      Object.values(RetailStores),
      this.retailStoresTypeSelection
    );
    initializeSelection(
      Object.values(HealthAndWellness),
      this.healthAndWellnessTypeSelection
    );
    initializeSelection(
      Object.values(Automotive),
      this.automotiveTypeSelection
    );
    initializeSelection(
      Object.values(PublicServicesAndGovernment),
      this.publicServicesAndGovernmentTypeSelection
    );
    initializeSelection(Object.values(Education), this.educationTypeSelection);
    initializeSelection(
      Object.values(TravelAndLodging),
      this.travelAndTourismTypeSelection
    );
    initializeSelection(
      Object.values(EntertainmentAndRecreation),
      this.entertainmentTypeSelection
    );
    initializeSelection(
      Object.values(HomeAndGarden),
      this.homeAndGardenTypeSelection
    );
    initializeSelection(
      Object.values(ReligiousPlaces),
      this.religiousPlacesTypeSelection
    );
  }

  private toggleAllTypes(event: any, typeSelection: TypesSelection[]) {
    typeSelection.forEach((type) => {
      type.selected = event.checked;
    });
  }

  private extractNumber(input: string): number {
    const match = input.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }
}
