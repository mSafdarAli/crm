import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPositionsComponent } from './print-positions.component';

describe('PrintPositionsComponent', () => {
  let component: PrintPositionsComponent;
  let fixture: ComponentFixture<PrintPositionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintPositionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintPositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
