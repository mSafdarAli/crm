import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColourPopupComponent } from './colour-popup.component';

describe('ColourPopupComponent', () => {
  let component: ColourPopupComponent;
  let fixture: ComponentFixture<ColourPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColourPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColourPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
