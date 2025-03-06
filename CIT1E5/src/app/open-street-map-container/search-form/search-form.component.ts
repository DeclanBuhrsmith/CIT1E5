import { Component, EventEmitter, Output } from '@angular/core';
import { SearchStateService } from '../services/search-state.service';

@Component({
  selector: 'search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent {
  address: string = '';
  selectedTransportationMode: string = '';
  transportationModes: string[] = ['Walk', 'Bike', 'Transit', 'Drive'];

  constructor(private searchStateService: SearchStateService) {}

  onSearch(): void {
    if (!this.address || !this.selectedTransportationMode) {
      return;
    }

    // Update the search state using signals
    this.searchStateService.setSearchData(
      this.address,
      this.selectedTransportationMode
    );
  }
}
