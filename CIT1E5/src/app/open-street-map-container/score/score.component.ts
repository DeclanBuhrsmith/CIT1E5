import { Component, Input, SimpleChanges } from '@angular/core';
import { AmenityType } from '../search-form/search-preferences/search-preferences.component';
import {
  OSMElement,
  OverpassService,
} from '../services/overpass-state.service';

@Component({
  selector: 'score',
  standalone: true,
  imports: [],
  templateUrl: './score.component.html',
  styleUrl: './score.component.scss',
})
export class ScoreComponent {
  @Input() selectedAmenities: AmenityType[] = [];
  @Input() nearbyPlaces: OSMElement[] = [];

  constructor(private overpassService: OverpassService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedAmenities']) {
      console.log(this.selectedAmenities);
    }
    if (changes['nearbyPlaces']) {
      console.log(this.nearbyPlaces);
    }
    this.calculateScore15(this.selectedAmenities, this.nearbyPlaces);
  }

  calculateScore15(amenities: AmenityType[], places: OSMElement[]) {
    places.forEach((place) => {
      if (place.tags) {
        let scoreCount = 0;
        amenities.forEach((amenity) => {
          if (place.tags) {
            if (
              this.overpassService.amenityTypeMap[amenity].includes(
                place.tags['amenity'].toString()
              )
            ) {
              scoreCount++;
              return;
            }
          }
        });
        console.log(scoreCount);
      }
    });
  }
}
