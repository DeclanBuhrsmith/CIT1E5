import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import  {MatCardModule } from '@angular/material/card';
import { NearbyPlaceCardComponent } from './nearby-place-card/nearby-place-card.component';
import {MatSelectModule} from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips';
import { ScoreComponent } from './score/score.component';



@NgModule({
  declarations: [LandingPageComponent, NearbyPlaceCardComponent, ScoreComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    GoogleMapsModule,
    MatIconModule,
    MatSlideToggleModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatOptionModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatCardModule,
    MatSelectModule,
    MatChipsModule
  ], exports: [LandingPageComponent, NearbyPlaceCardComponent, ScoreComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LandingPageModule { }
