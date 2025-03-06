import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OpenStreetMapContainerComponent } from './open-street-map-container/open-street-map-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, OpenStreetMapContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'CIT1E5';
}
