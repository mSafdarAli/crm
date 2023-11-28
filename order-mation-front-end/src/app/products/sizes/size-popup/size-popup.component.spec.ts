import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SizePopupComponent } from './size-popup.component';

describe('SizePopupComponent', () => {
  let component: SizePopupComponent;
  let fixture: ComponentFixture<SizePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SizePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SizePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
