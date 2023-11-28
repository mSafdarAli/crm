import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatOrderComponent } from './repeat-order.component';

describe('RepeatOrderComponent', () => {
  let component: RepeatOrderComponent;
  let fixture: ComponentFixture<RepeatOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepeatOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepeatOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
