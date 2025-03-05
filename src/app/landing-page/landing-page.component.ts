import {
  Component,
  HostBinding,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
import { LocationService } from './services/location.service';
import Map from 'ol/Map.js';
import { View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import { ConvertAddressToLatLonService } from './services/convert-address-to-latlon.service';


@Component({
  selector: 'landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
  @HostBinding('class') className = '';
  @ViewChild('gmap') gmap: GoogleMap | undefined;
  @ViewChild('addressInput') addresstext: any;
  @ViewChild('checkboxContainer') checkboxContainer: any;

  map: Map | undefined;

  address: string = '';
  mapOptions: google.maps.MapOptions = {
    zoom: 8
  };
  markerOptions: google.maps.MarkerOptions = {
    draggable: false
  };
  mapCenter: google.maps.LatLngLiteral = { lat: 44.977753, lng: -93.2650108 };
  currentGeoLocation: any;
  googleMapHeight = 500;

  // Google Objects
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

  financialServicesScore = 0;
  foodAndBeverageScore = 0;
  retailStoresScore = 0;
  healthAndWellnessScore = 0;
  automotiveScore = 0;
  publicServicesAndGovernmentScore = 0;
  educationScore = 0;
  entertainmentScore = 0;
  travelAndTourismScore = 0;
  homeAndGardenScore = 0;
  religiousPlacesScore = 0;
  totalScore = 0;

  codeblock = `calculatePlaceScore(): number {
      if (this.place?.duration && this.extractNumber(this.place.duration) <= 15) {
        return (1 - (this.extractNumber(this.place.duration) - 1) / 15) * this.getWeightByTravelMode(this.travelMode);
      }
      return 0;
    }`;
  showCodeBlock = false;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private convertAddressToLatLonService: ConvertAddressToLatLonService
  ) { }

  ngOnInit() {
    // Initialize the map
    // Pillar Cafe Forum default location.
    const defaultAddress = '2300 Central Ave NE, Minneapolis, MN 55418';
    let defaultCoordinates = {
      lat: 0,
      lng: 0
    }
    this.convertAddressToLatLonService.convertAddressToLatLon(defaultAddress).then((result) => {
      defaultCoordinates = {
        lat: result.latitude,
        lng: result.longitude
      }
    })
    this.map = new Map({
      view: new View({
        center: [defaultCoordinates.lat, defaultCoordinates.lng],
        zoom: 10,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: 'map'
    });
  }


  /**
   * Centers the map on the specified address using the Google Maps API geocoding.
   */
  centerMapOnAddress() {
    // Use Google Maps API to geocode the address
    // const geocoder = new google.maps.Geocoder();
    // geocoder.geocode({ address: this.address }, (results, status) => {
    //   if (status === 'OK' && results) {
    //     this.mapCenter = {
    //       lat: results[0].geometry.location.lat(),
    //       lng: results[0].geometry.location.lng(),
    //     };
    //     this.mapOptions = {
    //       zoom: 15
    //     }
    //   } else {
    //     console.error('Geocoding failed:', status);
    //   }
    // });


    // TODO: Uncomment this when we have a way to get the address from the user.
    // this.convertAddressToLatLonService.convertAddressToLatLon(this.address).then((result) => {
    //   this.map = {
    //     lat: result.latitude,
    //     lng: result.longitude
    //   }
    // })
  }

  /**
   * Retrieves the place autocomplete suggestions based on the user's input.
   * If the user has allowed location, it uses the current location as the default.
   * Otherwise, it prompts the user for location permission and retrieves the current location.
   * It also sets the formatted address and centers the map on the selected address.
   */
  async getPlaceAutocomplete() {
    // Ask for location first, and if they allow it, use that location as default.
    if (!this.currentGeoLocation) {
      await this.getCurrentGeolocation();
    }

    const autocomplete = new google.maps.places.Autocomplete(
      this.addresstext.nativeElement
    );
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.address = place.formatted_address || '';
      this.centerMapOnAddress();
    });
  }

  /**
   * Retrieves nearby places based on the selected checkboxes and types.
   * Clears the previous results and filters out duplicate places.
   */
  async getNearbyPlaces() {
    this.clearScoresAndNearbyPlaces();

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

  /**
   * Checks if all checkboxes are unchecked.
   * @returns {boolean} True if all checkboxes are unchecked, false otherwise.
   */
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

  /**
   * Calculates and returns the score based on the selected travel mode and nearby places.
   * The score is calculated by assigning a score to each nearby place based on its duration,
   * and then multiplying it by the weight of the selected travel mode.
   * @returns The calculated score.
   */
  setScoreTotalScore(place: NearbyPlaces): void {
    const travelWeight = this.getWeightByTravelMode(this.selectedTravelMode);
    this.totalScore = this.totalScore + place.score * travelWeight;
    // Sets the score for each of the categories.
    this.setScoreByCategory(place.categories, place.score, travelWeight);
  }

  sortParsedPlaces(nearbyPlaces: NearbyPlaces[]): NearbyPlaces[] {
    nearbyPlaces.sort((a, b) => {
      if (a.duration && b.duration) {
        const durationA = this.extractNumber(a.duration);
        const durationB = this.extractNumber(b.duration);
        return durationA - durationB;
      } else {
        return 0;
      }
    });
    return nearbyPlaces;
  }

  public getWeightByTravelMode(travelMode: TravelModeEnum): number {
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

  private getTravelRadiusByTravelMode(travelMode: TravelModeEnum): number {
    switch (travelMode) {
      case TravelModeEnum.WALKING:
        return 1500;
      case TravelModeEnum.BICYCLING:
        return 3000;
      case TravelModeEnum.TRANSIT:
        return 4000;
      default:
        return 5000;
    }
  }

  private countCheckboxesChecked(): number {
    let count = 0;
    const values = [
        this.financialServicesChecked,
        this.foodAndBeverageChecked,
        this.retailStoresChecked,
        this.healthAndWellnessChecked,
        this.automotiveChecked,
        this.publicServicesAndGovernmentChecked,
        this.educationChecked,
        this.entertainmentChecked,
        this.lodgingChecked,
        this.travelAndTourismChecked,
        this.homeAndGardenChecked,
        this.religiousPlacesChecked
    ];

    values.forEach(value => {
        if (value === true) {
            count++;
        }
    });

    return count;
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
                radius: this.getTravelRadiusByTravelMode(this.selectedTravelMode),
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
        score: 0,
        categories: this.setPlaceCategories(result.types || []),
      };
    });
    this.parsedNearbyPlaces.forEach(place => this.calculateDistanceFromNearbyPlaceToMapCenter(place));
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

  setScoreForPlace(place: NearbyPlaces) {
    this.setScoreTotalScore(place);
  }

  private toggleAllTypes(event: any, typeSelection: TypesSelection[]) {
    typeSelection.forEach((type) => {
      type.selected = event.checked;
    });
    this.googleMapHeight = 500 + (this.countCheckboxesChecked() * 100);
  }

  private extractNumber(input: string): number {
    const match = input.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  private setScoreByCategory(
    categories: string[],
    score: number,
    weight: number
  ) {
    categories.forEach((category) => {
      switch (category) {
        case 'Financial Services':
          this.financialServicesScore =
            this.financialServicesScore + score * weight;
          return;
        case 'Food and Beverage':
          this.foodAndBeverageScore =
            this.foodAndBeverageScore + score * weight;
          return;
        case 'Retail Stores':
          this.retailStoresScore = this.retailStoresScore + score * weight;
          return;
        case 'Health and Wellness':
          this.healthAndWellnessScore =
            this.healthAndWellnessScore + score * weight;
          return;
        case 'Automotive':
          this.automotiveScore = this.automotiveScore + score * weight;
          return;
        case 'Public Services and Government':
          this.publicServicesAndGovernmentScore =
            this.publicServicesAndGovernmentScore + score * weight;
          return;
        case 'Education':
          this.educationScore = this.educationScore + score * weight;
          return;
        case 'Entertainment and Recreation':
          this.entertainmentScore = this.entertainmentScore + score * weight;
          return;
        case 'Travel and Tourism':
          this.travelAndTourismScore =
            this.travelAndTourismScore + score * weight;
          return;
        case 'Home and Garden':
          this.homeAndGardenScore = this.homeAndGardenScore + score * weight;
          return;
        case 'Religious Places':
          this.religiousPlacesScore =
            this.religiousPlacesScore + score * weight;
          return;
      }
    });
  }

  private setPlaceCategories(types: string[]): string[] {
    const categories: string[] = [];

    if (types.some((type) => Object.values(FinancialServices).includes(type as FinancialServices))) {
      categories.push('Financial Services');
    }
    if (types.some((type) => Object.values(FoodAndBeverage).includes(type as FoodAndBeverage))) {
      categories.push('Food and Beverage');
    }
    if (types.some((type) => Object.values(RetailStores).includes(type as RetailStores))) {
      categories.push('Retail Stores');
    }
    if (types.some((type) => Object.values(HealthAndWellness).includes(type as HealthAndWellness))) {
      categories.push('Health and Wellness');
    }
    if (types.some((type) => Object.values(Automotive).includes(type as Automotive))) {
      categories.push('Automotive');
    }
    if (types.some((type) => Object.values(PublicServicesAndGovernment).includes(type as PublicServicesAndGovernment))) {
      categories.push('Public Services and Government');
    }
    if (types.some((type) => Object.values(Education).includes(type as Education))) {
      categories.push('Education');
    }
    if (types.some((type) => Object.values(EntertainmentAndRecreation).includes(type as EntertainmentAndRecreation))) {
      categories.push('Entertainment and Recreation');
    }
    if (types.some((type) => Object.values(TravelAndLodging).includes(type as TravelAndLodging))) {
      categories.push('Travel and Tourism');
    }
    if (types.some((type) => Object.values(HomeAndGarden).includes(type as HomeAndGarden))) {
      categories.push('Home and Garden');
    }
    if (types.some((type) => Object.values(ReligiousPlaces).includes(type as ReligiousPlaces))) {
      categories.push('Religious Places');
    }

    return categories;
  }

  private clearScoresAndNearbyPlaces() {
    // Clear the previous results
    this.parsedNearbyPlaces = [];
    this.nearbyPlaces = [];

    // Clear the previous scores
    this.financialServicesScore = 0;
    this.foodAndBeverageScore = 0;
    this.retailStoresScore = 0;
    this.healthAndWellnessScore = 0;
    this.automotiveScore = 0;
    this.publicServicesAndGovernmentScore = 0;
    this.educationScore = 0;
    this.entertainmentScore = 0;
    this.travelAndTourismScore = 0;
    this.homeAndGardenScore = 0;
    this.religiousPlacesScore = 0;
    this.totalScore = 0;
  }

  private async getCurrentGeolocation() {
    // await this.locationService.getCurrentLocation().then((location) => {
    //   this.currentGeoLocation = location;

    //   // Get the formatted address from the current location
    //   const geocoder = new google.maps.Geocoder();
    //   geocoder.geocode(
    //     { location: this.currentGeoLocation },
    //     (results, status) => {
    //       if (status === 'OK' && results && results.length > 0) {
    //         this.address = results[0].formatted_address;
    //         this.centerMapOnAddress();
    //       } else {
    //         console.error('Geocoding failed:', status);
    //       }
    //     }
    //   );
    // });
  }

  private calculateDistanceFromNearbyPlaceToMapCenter(place: NearbyPlaces) {
    if (place) {
      new google.maps.DirectionsService()
        .route({
          origin: this.mapCenter,
          destination: place.location,
          travelMode: this.selectedTravelMode as any
        })
        .then((response) => {
          const duration = response.routes[0]?.legs[0]?.duration?.text || '';
          const distance = response.routes[0]?.legs[0]?.distance?.text || '';
          if (place) {
            place.duration = duration;
            place.distance = distance;
            place.score = this.calculatePlaceScore(place);
          }
        });
    }
  }

  private calculatePlaceScore(place: NearbyPlaces): number {
    if (place?.duration && this.extractNumber(place.duration) <= 15) {
      return (1 - (this.extractNumber(place.duration) - 1) / 15) * this.getWeightByTravelMode(this.selectedTravelMode);
    }
    return 0;
  }

  private getMinimumDistanceBySelectedTypes(): number {
    return 0;
  }
}
