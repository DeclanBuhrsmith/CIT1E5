import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { NearbyPlaces } from '../interfaces/nearby-places';

@Component({
  selector: 'nearby-place-card',
  templateUrl: './nearby-place-card.component.html',
  styleUrl: './nearby-place-card.component.scss'
})
export class NearbyPlaceCardComponent implements OnInit {

  @Input() mapCenter: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  @Input() place: NearbyPlaces | undefined;
  //@Input() travelMode: google.maps.TravelMode = google.maps.TravelMode.BICYCLING;


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }

}
