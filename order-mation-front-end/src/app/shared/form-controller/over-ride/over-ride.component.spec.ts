import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverRideComponent } from './over-ride.component';

describe('OverRideComponent', () => {
  let component: OverRideComponent;
  let fixture: ComponentFixture<OverRideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverRideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
