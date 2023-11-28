import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewtaskPopupComponent } from './newtask-popup.component';

describe('NewtaskPopupComponent', () => {
  let component: NewtaskPopupComponent;
  let fixture: ComponentFixture<NewtaskPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewtaskPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewtaskPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
