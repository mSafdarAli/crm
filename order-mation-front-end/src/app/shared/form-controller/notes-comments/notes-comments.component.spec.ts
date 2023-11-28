import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesCommentsComponent } from './notes-comments.component';

describe('NotesCommentsComponent', () => {
  let component: NotesCommentsComponent;
  let fixture: ComponentFixture<NotesCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotesCommentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotesCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
