import { Component, Input } from '@angular/core';
import { OSMElement } from '../services/overpass-state.service';
import { NominatimResponse } from '../services/search-state.service';

@Component({
  selector: 'search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent {
  @Input() places: OSMElement[] = [];
  @Input() searchResults: NominatimResponse[] | null | undefined;
  @Input() errorMessage: string | null = null;
  @Input() overpassError: string | null = null;
}
