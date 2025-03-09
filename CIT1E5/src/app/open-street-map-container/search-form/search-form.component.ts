import { Component } from '@angular/core';
import { SearchStateService } from '../services/search-state.service';

@Component({
  selector: 'search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent {
  address: string = '';

  constructor(private searchStateService: SearchStateService) {}

  onSearch(): void {
    if (!this.address) {
      return;
    }

    // Update the search state using signals
    this.searchStateService.setSearchData(this.address);
  }
}
