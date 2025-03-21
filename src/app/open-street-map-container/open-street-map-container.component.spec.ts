import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenStreetMapContainerComponent } from './open-street-map-container.component';

describe('OpenStreetMapContainerComponent', () => {
  let component: OpenStreetMapContainerComponent;
  let fixture: ComponentFixture<OpenStreetMapContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenStreetMapContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpenStreetMapContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
