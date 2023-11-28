import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintBrandingPurchaseComponent } from './print-branding-purchase.component';

describe('PrintBrandingPurchaseComponent', () => {
  let component: PrintBrandingPurchaseComponent;
  let fixture: ComponentFixture<PrintBrandingPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintBrandingPurchaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintBrandingPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
