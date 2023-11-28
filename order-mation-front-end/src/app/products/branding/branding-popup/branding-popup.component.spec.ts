import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandingPopupComponent } from './branding-popup.component';

describe('BrandingPopupComponent', () => {
  let component: BrandingPopupComponent;
  let fixture: ComponentFixture<BrandingPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandingPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandingPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
