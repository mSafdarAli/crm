import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtrapriceComponent } from './extraprice.component';

describe('ExtrapriceComponent', () => {
  let component: ExtrapriceComponent;
  let fixture: ComponentFixture<ExtrapriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtrapriceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtrapriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
