import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GoogleMapsModule } from '@angular/google-maps';



@NgModule({
  declarations: [LandingPageComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    GoogleMapsModule
  ], exports: [LandingPageComponent]
})
export class LandingPageModule { }
