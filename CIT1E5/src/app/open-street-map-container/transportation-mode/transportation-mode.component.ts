import { Component, EventEmitter, Output } from '@angular/core';

export enum TransportationMode {
  Walk = 'Walk',
  Bike = 'Bike',
  Transit = 'Transit',
  Drive = 'Drive',
}

@Component({
  selector: 'transportation-mode',
  templateUrl: './transportation-mode.component.html',
  styleUrls: ['./transportation-mode.component.scss'],
})
export class TransportationModeComponent {
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
