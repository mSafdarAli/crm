import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTargetComponent } from './new-target.component';

describe('NewTargetComponent', () => {
  let component: NewTargetComponent;
  let fixture: ComponentFixture<NewTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTargetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
