import { Component } from '@angular/core';
import { OpenStreetMapComponent } from './open-street-map/open-street-map.component';

@Component({
  selector: 'open-street-map-container',
  standalone: true,
  imports: [OpenStreetMapComponent],
  templateUrl: './open-street-map-container.component.html',
  styleUrl: './open-street-map-container.component.scss'
})
export class OpenStreetMapContainerComponent {

}
