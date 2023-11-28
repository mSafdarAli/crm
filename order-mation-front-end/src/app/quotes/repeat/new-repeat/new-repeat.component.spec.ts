import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRepeatComponent } from './new-repeat.component';

describe('NewRepeatComponent', () => {
  let component: NewRepeatComponent;
  let fixture: ComponentFixture<NewRepeatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewRepeatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRepeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
