import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Ensure FormsModule is imported
import { CommonModule } from '@angular/common'; // Ensure CommonModule is imported

@Component({
  selector: 'search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule], // Ensure CommonModule is included in imports
})
export class SearchFormComponent {
  address: string = '';
  selectedTransportationMode: string = '';
  transportationModes: string[] = ['Walk', 'Bike', 'Transit', 'Drive'];
  errorMessage: string | null = null;

  @Output() searchEvent = new EventEmitter<{
    address: string;
    transportationMode: string;
  }>();

  onSearch(): void {
    if (!this.address || !this.selectedTransportationMode) {
      this.errorMessage =
        'Please enter an address and select a transportation mode.';
      return;
    }

    this.errorMessage = null;

    // Emit the search event with the address and transportation mode
    this.searchEvent.emit({
      address: this.address,
      transportationMode: this.selectedTransportationMode,
    });
  }
}
