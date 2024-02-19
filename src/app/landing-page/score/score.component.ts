import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'score',
  templateUrl: './score.component.html',
  styleUrl: './score.component.scss',
})
export class ScoreComponent {
  @Input() financialServicesScore: number = 0;
  @Input() foodAndBeverageScore: number = 0;
  @Input() retailStoresScore: number = 0;
  @Input() healthAndWellnessScore: number = 0;
  @Input() automotiveScore: number = 0;
  @Input() publicServicesAndGovernmentScore: number = 0;
  @Input() educationScore: number = 0;
  @Input() entertainmentScore: number = 0;
  @Input() travelAndTourismScore: number = 0;
  @Input() homeAndGardenScore: number = 0;
  @Input() religiousPlacesScore: number = 0;
  @Input() totalScore: number = 0;
  @Input() nearbyPlaceCount: number = 0;

  @Input() financialServicesChecked: boolean = false;
  @Input() foodAndBeverageChecked: boolean = false;
  @Input() retailStoresChecked: boolean = false;
  @Input() healthAndWellnessChecked: boolean = false;
  @Input() automotiveChecked: boolean = false;
  @Input() publicServicesAndGovernmentChecked: boolean = false;
  @Input() educationChecked: boolean = false;
  @Input() entertainmentChecked: boolean = false;
  @Input() lodgingChecked: boolean = false;
  @Input() travelAndTourismChecked: boolean = false;
  @Input() homeAndGardenChecked: boolean = false;
  @Input() religiousPlacesChecked: boolean = false;
}
