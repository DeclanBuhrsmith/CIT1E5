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
import { Automotive, Education, EntertainmentAndRecreation, FinancialServices, FoodAndBeverage, HealthAndWellness, HomeAndGarden, PublicServicesAndGovernment, ReligiousPlaces, RetailStores, TravelAndLodging } from './enums/types';

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
  financialServicesTypeSelection: TypesSelection[] = [];
  foodAndBeverageTypeSelection: TypesSelection[] = [];
  retailStoresTypeSelection: TypesSelection[] = [];
  healthAndWellnessTypeSelection: TypesSelection[] = [];
  automotiveTypeSelection: TypesSelection[] = [];
  publicServicesAndGovernmentTypeSelection: TypesSelection[] = [];
  educationTypeSelection: TypesSelection[] = [];
  entertainmentTypeSelection: TypesSelection[] = [];
  lodgingTypeSelection: TypesSelection[] = [];
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

  renderRoute(response: any) {
    const renderer = new google.maps.DirectionsRenderer();
    if (this.gmap?.googleMap) {
      renderer.setDirections(response);
      renderer.setMap(this.gmap.googleMap);
    }
  }

  toggleAllFinancialServices(event: any) {
    this.toggleAllTypes(event, this.financialServicesTypeSelection);
  }

  toggleAllFoodAndBeverage(event: any) {
    this.toggleAllTypes(event, this.foodAndBeverageTypeSelection);
  }

  toggleAllRetailStores(event: any) {
    this.toggleAllTypes(event, this.retailStoresTypeSelection);
  }

  toggleAllHealthAndWellness(event: any) {
    this.toggleAllTypes(event, this.healthAndWellnessTypeSelection);
  }

  toggleAllAutomotive(event: any) {
    this.toggleAllTypes(event, this.automotiveTypeSelection);
  }

  toggleAllPublicServicesAndGovernment(event: any) {
    this.toggleAllTypes(event, this.publicServicesAndGovernmentTypeSelection);
  }

  toggleAllEducation(event: any) {
    this.toggleAllTypes(event, this.educationTypeSelection);
  }

  toggleAllEntertainment(event: any) {
    this.toggleAllTypes(event, this.entertainmentTypeSelection);
  }

  toggleAllLodging(event: any) {
    this.toggleAllTypes(event, this.lodgingTypeSelection);
  }

  toggleAllTravelAndTourism(event: any) {
    this.toggleAllTypes(event, this.travelAndTourismTypeSelection);
  }

  toggleAllHomeAndGarden(event: any) {
    this.toggleAllTypes(event, this.homeAndGardenTypeSelection);
  }

  toggleAllReligiousPlaces(event: any) {
    this.toggleAllTypes(event, this.religiousPlacesTypeSelection);
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
        marker.addListener('click', () => {});
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
          // console.log(response.routes[0]?.legs[0]?.distance?.text);
          // console.log(response.routes[0]?.legs[0]?.duration?.text);
          // This draws the route on the map for how to get there.
          // const renderer = new google.maps.DirectionsRenderer();
          // renderer.setDirections(response);
          // if (this.gmap?.googleMap) {
          //   renderer.setMap(this.gmap.googleMap);
          // }
        });
    });
  }

  private initializeTypesSelection() {
    const initializeSelection = (values: string[], selection: TypesSelection[]) => {
      values.forEach((value) => {
        selection.push({
          type: value,
          selected: false,
        });
      });
    };

    initializeSelection(Object.values(FinancialServices), this.financialServicesTypeSelection);
    initializeSelection(Object.values(FoodAndBeverage), this.foodAndBeverageTypeSelection);
    initializeSelection(Object.values(RetailStores), this.retailStoresTypeSelection);
    initializeSelection(Object.values(HealthAndWellness), this.healthAndWellnessTypeSelection);
    initializeSelection(Object.values(Automotive), this.automotiveTypeSelection);
    initializeSelection(Object.values(PublicServicesAndGovernment), this.publicServicesAndGovernmentTypeSelection);
    initializeSelection(Object.values(Education), this.educationTypeSelection);
    initializeSelection(Object.values(TravelAndLodging), this.travelAndTourismTypeSelection);
    initializeSelection(Object.values(EntertainmentAndRecreation), this.entertainmentTypeSelection);
    initializeSelection(Object.values(TravelAndLodging), this.lodgingTypeSelection);
    initializeSelection(Object.values(HomeAndGarden), this.homeAndGardenTypeSelection);
    initializeSelection(Object.values(ReligiousPlaces), this.religiousPlacesTypeSelection);
  }

  private toggleAllTypes(event: any, typeSelection: TypesSelection[]) {
    typeSelection.forEach((type) => {
      type.selected = event.checked;
    });
  }
}
