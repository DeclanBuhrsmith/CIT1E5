import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearbyPlaceCardComponent } from './nearby-place-card.component';

describe('NearbyPlaceCardComponent', () => {
  let component: NearbyPlaceCardComponent;
  let fixture: ComponentFixture<NearbyPlaceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NearbyPlaceCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NearbyPlaceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
