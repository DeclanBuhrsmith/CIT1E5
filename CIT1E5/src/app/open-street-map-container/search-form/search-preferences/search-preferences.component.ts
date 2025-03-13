import { Component, EventEmitter, Output } from '@angular/core';

export enum TransportationMode {
  Walk = 'Walk',
  Bike = 'Bike',
  Transit = 'Transit',
  Drive = 'Drive',
}

export enum AmenityType {
  Education = 'Education ',
  Healthcare = 'Healthcare',
  Transportation = 'Transportation',
  FoodAndDrink = 'Food and Drink',
  Shopping = 'Shopping',
  RecreationAndLeisure = 'Recreation and Leisure',
  PublicServices = 'Public Services',
  Religious = 'Religious',
  Accommodation = 'Accommodation',
  FinancialServices = 'Financial Services',
  Utilities = 'Utilities',
  Other = 'Other',
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
  selectedAmenities: AmenityType[] = [
    AmenityType.Education,
    AmenityType.Healthcare,
    AmenityType.Transportation,
    AmenityType.FoodAndDrink,
    AmenityType.Shopping,
    AmenityType.RecreationAndLeisure,
    AmenityType.PublicServices,
    AmenityType.Religious,
    AmenityType.Accommodation,
    AmenityType.FinancialServices,
    AmenityType.Utilities,
    AmenityType.Other,
  ];
  amenities: AmenityType[] = [
    AmenityType.Education,
    AmenityType.Healthcare,
    AmenityType.Transportation,
    AmenityType.FoodAndDrink,
    AmenityType.Shopping,
    AmenityType.RecreationAndLeisure,
    AmenityType.PublicServices,
    AmenityType.Religious,
    AmenityType.Accommodation,
    AmenityType.FinancialServices,
    AmenityType.Utilities,
    AmenityType.Other,
  ];

  @Output() setSelectedTransportationMode = new EventEmitter<{
    currentTransportationMode: TransportationMode;
  }>();
  @Output() setSelectedAmenities = new EventEmitter<{
    currentSelectedAmenities: AmenityType[];
  }>();

  ngOnInit(): void {
    // Sets the currentSelectedAmenities to be completed selected by default
    this.setSelectedAmenities.emit({
      currentSelectedAmenities: this.selectedAmenities as AmenityType[],
    });
  }

  onModeChange(): void {
    this.setSelectedTransportationMode.emit({
      currentTransportationMode: this
        .currentTransportationMode as TransportationMode,
    });
  }

  onAmenityChange(amenity: AmenityType, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedAmenities.push(amenity);
    } else {
      this.selectedAmenities = this.selectedAmenities.filter(
        (a) => a !== amenity
      );
    }
    this.setSelectedAmenities.emit({
      currentSelectedAmenities: this.selectedAmenities as AmenityType[],
    });
  }
}
