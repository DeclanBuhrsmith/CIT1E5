import { Component, EventEmitter, Output } from '@angular/core';
import { SearchStateService } from '../services/search-state.service';
import {
  AmenityType,
  TransportationMode,
} from './search-preferences/search-preferences.component';

@Component({
  selector: 'search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent {
  @Output() setSelectedTransportationMode = new EventEmitter<{
    currentTransportationMode: TransportationMode;
  }>();
  @Output() setSelectedAmenities = new EventEmitter<{
    currentSelectedAmenities: AmenityType[];
  }>();
  @Output() onFetchPlaces = new EventEmitter<{}>();
  @Output() toggleBoundaries = new EventEmitter<boolean>();
  @Output() speedChange = new EventEmitter<number>();
  address: string = '';
  currentTransportationMode: TransportationMode = TransportationMode.Walk;
  currentSelectedAmenities: AmenityType[] | undefined;
  showBoundaries: boolean = false;

  constructor(private searchStateService: SearchStateService) {}

  onSearch(): void {
    if (!this.address) {
      return;
    }

    // Update the search state using signals
    this.searchStateService.setSearchData(this.address);
  }

  onTransportationModeUpdated(transportationMode: TransportationMode) {
    this.currentTransportationMode = transportationMode;
    this.setSelectedTransportationMode.emit({
      currentTransportationMode: transportationMode,
    });
  }

  onAmenitiesUpdated(amenities: AmenityType[]) {
    this.currentSelectedAmenities = amenities;
    this.setSelectedAmenities.emit({
      currentSelectedAmenities: amenities as AmenityType[],
    });
  }

  onToggleBoundaries(): void {
    this.toggleBoundaries.emit(this.showBoundaries);
  }

  onSpeedChange(speed: number): void {
    this.speedChange.emit(speed);
  }
}
