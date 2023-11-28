import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchPopupComponent } from './dispatch-popup.component';

describe('DispatchPopupComponent', () => {
  let component: DispatchPopupComponent;
  let fixture: ComponentFixture<DispatchPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatchPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
