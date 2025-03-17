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
  @Input() places: OSMElement[] = [];

  constructor(private overpassService: OverpassService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedAmenities']) {
    }
    if (changes['places']) {
      this.calculateScore15(this.selectedAmenities, this.places);
    }
  }

  calculateScore15(amenities: AmenityType[], places: OSMElement[]) {
    console.log(amenities);
  }
}
