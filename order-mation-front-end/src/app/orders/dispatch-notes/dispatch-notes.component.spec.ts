import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchNotesComponent } from './dispatch-notes.component';

describe('DispatchNotesComponent', () => {
  let component: DispatchNotesComponent;
  let fixture: ComponentFixture<DispatchNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchNotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatchNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
