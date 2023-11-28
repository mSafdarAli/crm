import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullWindowComponent } from './full-window.component';

describe('FullWindowComponent', () => {
  let component: FullWindowComponent;
  let fixture: ComponentFixture<FullWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullWindowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
