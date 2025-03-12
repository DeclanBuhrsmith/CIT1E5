import { Component, EventEmitter, Output } from '@angular/core';

export enum TransportationMode {
  Walk = 'Walk',
  Bike = 'Bike',
  Transit = 'Transit',
  Drive = 'Drive',
}

@Component({
  selector: 'search-preferences',
  templateUrl: './search-preferences.component.html',
  styleUrls: ['./search-preferences.component.scss'],
})
export class SearchPreferencesComponent {
  currentTransportationMode: string = '';
  transportationModes: TransportationMode[] = [
    TransportationMode.Walk,
    TransportationMode.Bike,
    TransportationMode.Transit,
    TransportationMode.Drive,
  ];

  @Output() setSelectedTransportationMode = new EventEmitter<{
    currentTransportationMode: TransportationMode;
  }>();

  onModeChange(): void {
    this.setSelectedTransportationMode.emit({
      currentTransportationMode: this
        .currentTransportationMode as TransportationMode,
    });
  }
}
