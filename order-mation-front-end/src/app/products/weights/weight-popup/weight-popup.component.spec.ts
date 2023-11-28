import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightPopupComponent } from './weight-popup.component';

describe('WeightPopupComponent', () => {
  let component: WeightPopupComponent;
  let fixture: ComponentFixture<WeightPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeightPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeightPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
