import { Component, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { OpenStreetMapContainerComponent } from './open-street-map-container/open-street-map-container.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'CIT1E5';
  isDarkModeEnabled: boolean = false; // Track dark mode state

  @ViewChild(OpenStreetMapContainerComponent) mapContainerComponent!: OpenStreetMapContainerComponent;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Access the OpenStreetMapComponent through the container
    const mapComponent = this.mapContainerComponent?.mapComponent;
    if (!mapComponent) {
      console.error('OpenStreetMapComponent is undefined');
    }
  }

  toggleDarkMode(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.isDarkModeEnabled = isChecked; // Update dark mode state
    if (isChecked) {
      this.renderer.addClass(document.body, 'dark-mode');
      this.mapContainerComponent?.mapComponent?.toggleMapDarkMode(true);
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
      this.mapContainerComponent?.mapComponent?.toggleMapDarkMode(false);
    }
  }
}
