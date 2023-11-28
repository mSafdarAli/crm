import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandingDetailsComponent } from './branding-details.component';

describe('BrandingDetailsComponent', () => {
  let component: BrandingDetailsComponent;
  let fixture: ComponentFixture<BrandingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandingDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
