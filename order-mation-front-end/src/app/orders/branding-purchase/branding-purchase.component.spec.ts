import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandingPurchaseComponent } from './branding-purchase.component';

describe('BrandingPurchaseComponent', () => {
  let component: BrandingPurchaseComponent;
  let fixture: ComponentFixture<BrandingPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandingPurchaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandingPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
