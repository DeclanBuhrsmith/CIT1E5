import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { NearbyPlaces } from '../interfaces/nearby-places';
import { TravelModeEnum } from '../enums/travel-modes';

@Component({
  selector: 'nearby-place-card',
  templateUrl: './nearby-place-card.component.html',
  styleUrl: './nearby-place-card.component.scss',
})
export class NearbyPlaceCardComponent implements OnInit, OnChanges {
  @Input() mapCenter: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  @Input() place: NearbyPlaces | undefined;
  @Input() travelMode: TravelModeEnum = TravelModeEnum.WALKING;

  @Output() renderRoute = new EventEmitter<any>();
  @Output() setScoreForPlace = new EventEmitter<NearbyPlaces>();

  duration: string = '';
  distance: string = '';
  routeResponse: any;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['travelMode']) {
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
          this.routeResponse = response;
          this.duration = response.routes[0]?.legs[0]?.duration?.text || '';
          this.distance = response.routes[0]?.legs[0]?.distance?.text || '';
          if (this.place) {
            this.place.duration = this.duration;
            this.place.distance = this.distance;
            this.place.score = this.calculatePlaceScore();
            this.setScoreForPlace.emit(this.place);
          }
        });
    }
  }

  private calculatePlaceScore(): number {
    if (this.place?.duration && this.extractNumber(this.place.duration) <= 15) {
      return (1 - (this.extractNumber(this.place.duration) - 1) / 15) * this.getWeightByTravelMode(this.travelMode);
    }
    return 0;
  }

  private extractNumber(input: string): number {
    const match = input.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
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
}
