import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewActionTypeComponent } from './new-action-type.component';

describe('NewActionTypeComponent', () => {
  let component: NewActionTypeComponent;
  let fixture: ComponentFixture<NewActionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewActionTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewActionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
