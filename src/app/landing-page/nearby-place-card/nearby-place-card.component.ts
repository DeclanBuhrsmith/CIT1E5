import { AfterViewInit, Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { NearbyPlaces } from '../interfaces/nearby-places';
import { TravelModeEnum } from '../enums/travel-modes';

@Component({
  selector: 'nearby-place-card',
  templateUrl: './nearby-place-card.component.html',
  styleUrl: './nearby-place-card.component.scss'
})
export class NearbyPlaceCardComponent implements OnInit, OnChanges {

  @Input() mapCenter: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  @Input() place: NearbyPlaces | undefined;
  @Input() travelMode: TravelModeEnum = TravelModeEnum.BICYCLING;

  @Output() renderRoute = new EventEmitter<any>();

  duration: string = '';
  distance: string = '';
  routeResponse: any;


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }

  ngOnChanges(changes: SimpleChanges): void {
      if(changes['travelMode']) {
        this.calculateDistanceFromNearbyPlacesToMapCenter();
      }
  }

  // renderRoute() {
  //       const renderer = new google.maps.DirectionsRenderer();
  //       renderer.setDirections(response);
  //       if (this.gmap?.googleMap) {
  //         renderer.setMap(this.gmap.googleMap);
  //       }
  // }

  private calculateDistanceFromNearbyPlacesToMapCenter() {
    if (this.place) {
      new google.maps.DirectionsService()
      .route({
        origin: this.mapCenter,
        destination: this.place.location,
        travelMode: this.travelMode as any,
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
        this.routeResponse = response;
        this.duration = response.routes[0]?.legs[0]?.duration?.text || '';
        this.distance = response.routes[0]?.legs[0]?.distance?.text || '';

      });
    }
  }

}
