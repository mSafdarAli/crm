import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOverrideComponent } from './new-override.component';

describe('NewOverrideComponent', () => {
  let component: NewOverrideComponent;
  let fixture: ComponentFixture<NewOverrideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewOverrideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewOverrideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
