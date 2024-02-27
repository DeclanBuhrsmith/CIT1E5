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
export class NearbyPlaceCardComponent {
  @Input() place: NearbyPlaces | undefined;

  getHighlightColor(score: number): string {
    if (score <= 0) {
      return 'transparent';  // No highlight for score 0
    } else {
      return `rgba(0, 255, 0, ${score * 0.5})`;  // Return a color in the RGB format
    }
  }
}
