import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionPopupComponent } from './position-popup.component';

describe('PositionPopupComponent', () => {
  let component: PositionPopupComponent;
  let fixture: ComponentFixture<PositionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
