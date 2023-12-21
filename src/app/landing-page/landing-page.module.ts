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


@NgModule({
  declarations: [LandingPageComponent],
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
    MatCheckboxModule
  ], exports: [LandingPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LandingPageModule { }
