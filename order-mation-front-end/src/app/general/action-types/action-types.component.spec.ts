import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionTypesComponent } from './action-types.component';

describe('ActionTypesComponent', () => {
  let component: ActionTypesComponent;
  let fixture: ComponentFixture<ActionTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionTypesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
