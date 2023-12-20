import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [LandingPageComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    GoogleMapsModule,
    MatIconModule,
    MatSlideToggleModule,
    MatInputModule
  ], exports: [LandingPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LandingPageModule { }
