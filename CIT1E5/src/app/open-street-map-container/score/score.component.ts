import { Component, Input, SimpleChanges } from '@angular/core';
import { AmenityType } from '../search-form/search-preferences/search-preferences.component';
import {
  OSMElement,
} from '../services/overpass-state.service';


interface ScoreAmenity {
  amenity: AmenityType;
  amenityFound: boolean;
}
@Component({
  selector: 'score',
  templateUrl: './score.component.html',
  styleUrl: './score.component.scss',
})

export class ScoreComponent {
  @Input() selectedAmenities: AmenityType[] = [];
  @Input() placesUnder15: OSMElement[] = [];
  score: number = 0;
  scoreAmenities: ScoreAmenity[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedAmenities'] || changes['placesUnder15']) {
      this.scoreAmenities = this.selectedAmenities.map((amenity) => ({
        amenity: amenity,
        amenityFound: false,
      }));
      this.score = this.calculateScore(this.placesUnder15, this.selectedAmenities);
    }
  }

  private calculateScore(places: OSMElement[], amenities: AmenityType[]): number {
    let score = 0;
    for (const amenity of amenities) {
      for (const place of places) {
        if (place.tags && place.tags['amenity_type'] === amenity) {
          score += 1; // Increment score for each matching amenity
          this.scoreAmenities.push({
            amenity: amenity,
            amenityFound: true,
          });
          break; // Break after finding the first match
        }
      }
      if (score >= amenities.length) {
        break; // Ensure score does not exceed the length of amenities
      }
    }
    return score;
  }
}
