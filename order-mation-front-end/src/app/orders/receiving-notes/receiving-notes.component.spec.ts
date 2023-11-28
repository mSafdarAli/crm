import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingNotesComponent } from './receiving-notes.component';

describe('ReceivingNotesComponent', () => {
  let component: ReceivingNotesComponent;
  let fixture: ComponentFixture<ReceivingNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivingNotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceivingNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
