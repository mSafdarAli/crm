import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentComplaintsComponent } from './current-complaints.component';

describe('CurrentComplaintsComponent', () => {
  let component: CurrentComplaintsComponent;
  let fixture: ComponentFixture<CurrentComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentComplaintsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
