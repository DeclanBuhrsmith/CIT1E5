import { Component, Input } from '@angular/core';
import { AmenityType } from '../search-form/search-preferences/search-preferences.component';
import { OSMElement } from '../services/overpass-state.service';

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
}
