import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigntoPopupComponent } from './assignto-popup.component';

describe('AssigntoPopupComponent', () => {
  let component: AssigntoPopupComponent;
  let fixture: ComponentFixture<AssigntoPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssigntoPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssigntoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
