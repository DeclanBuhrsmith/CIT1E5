import { Component, EventEmitter, Output } from '@angular/core';
import { SearchStateService } from '../services/search-state.service';
import { TransportationMode } from './search-preferences/search-preferences.component';

@Component({
  selector: 'search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent {
  @Output() setSelectedTransportationMode = new EventEmitter<{
    currentTransportationMode: TransportationMode;
  }>();
  address: string = '';

  constructor(private searchStateService: SearchStateService) {}

  onSearch(): void {
    if (!this.address) {
      return;
    }

    // Update the search state using signals
    this.searchStateService.setSearchData(this.address);
  }

  transportationModeUpdated(transportationMode: TransportationMode) {
    this.setSelectedTransportationMode.emit({
      currentTransportationMode: transportationMode,
    });
  }
}
