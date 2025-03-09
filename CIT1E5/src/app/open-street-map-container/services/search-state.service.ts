import { Injectable, signal, effect } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { TransportationMode } from '../transportation-mode/transportation-mode.component';

// Define the structure of the Nominatim response
export interface NominatimResponse {
  lat: number;
  lon: number;
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class SearchStateService {
  private readonly NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

  // Use signals to manage state
  private searchData = signal<{
    address: string;
  } | null>(null);
  private nominatimResponse = signal<NominatimResponse[] | null>(null);
  private errorMessage = signal<string | null>(null);

  // Expose signals as read-only
  searchData$ = this.searchData.asReadonly();
  nominatimResponse$ = this.nominatimResponse.asReadonly();
  error$ = this.errorMessage.asReadonly();

  constructor(private http: HttpClient) {
    // React to changes in searchData and call the Nominatim API
    effect(
      () => {
        const searchData = this.searchData();
        if (searchData) {
          this.geocode(searchData.address).subscribe({
            next: (response) => this.nominatimResponse.set(response),
            error: (err) => {
              this.errorMessage.set(
                'An error occurred while fetching the data.'
              );
              console.error(err);
            },
          });
        } else {
          this.nominatimResponse.set(null);
        }
      },
      { allowSignalWrites: true }
    );
  }

  setSearchData(address: string): void {
    this.searchData.set({ address });
  }

  // Method to call the Nominatim API
  private geocode(address: string): Observable<NominatimResponse[] | null> {
    if (!address) {
      return of(null);
    }

    const params = new HttpParams()
      .set('q', address)
      .set('format', 'json')
      .set('limit', '1')
      .set('addressdetails', '1');

    return this.http.get<NominatimResponse[]>(this.NOMINATIM_URL, { params });
  }
}
