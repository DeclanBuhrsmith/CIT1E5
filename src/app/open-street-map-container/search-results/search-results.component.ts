import { Component, Input, SimpleChanges } from '@angular/core';
import { OSMElement } from '../services/overpass-state.service';
import { NominatimResponse } from '../services/search-state.service';

@Component({
  selector: 'search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent {
  @Input() placesUnder15: OSMElement[] = [];
  @Input() searchResults: NominatimResponse[] | null | undefined;
  @Input() errorMessage: string | null = null;
  @Input() overpassError: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['placesUnder15']) {

    }
  }
}
