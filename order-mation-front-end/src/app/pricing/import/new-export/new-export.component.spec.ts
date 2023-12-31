import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewExportComponent } from './new-export.component';

describe('NewExportComponent', () => {
  let component: NewExportComponent;
  let fixture: ComponentFixture<NewExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewExportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
