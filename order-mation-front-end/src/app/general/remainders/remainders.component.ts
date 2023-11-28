import { Component, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap } from 'rxjs/operators';
import { lookupdata } from 'src/_models/lookup';
import { MessageService } from 'src/_services/message.service';
import { RemindersService } from 'src/_services/rest/reminders.service';
import { SortService } from 'src/_services/sort.service';
import { NewReminderComponent } from './new-reminder/new-reminder.component';

@Component({
  selector: 'app-remainders',
  templateUrl: './remainders.component.html',
  styleUrls: ['./remainders.component.scss'],
})
export class RemaindersComponent implements OnInit {
  data: any[] = [];
  count: number = 0;
  start: number = 1;
  end: number = 50;
  search: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewReminderComponent>,
    private dialog: MatDialog,
    private reminderService: RemindersService,
    private messageService: MessageService,
    private toaster: ToastrService,
    private sortService: SortService
  ) {
    this.search = this.formBuilder.group({
      search: [''],
    });
  }
  ngOnInit(): void {
    this.getAllRemminders({ startCount: this.start, endCount: this.end });
  }
  newDialog(id = null) {
    const DialogRef = this.dialog.open(NewReminderComponent, {
      data: { id: id },
      width: '80%',
      height: '70%',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getAllRemminders({ startCount: this.start, endCount: this.end });
      sub.unsubscribe();
    });
  }
  searchActionTypes(params) {
    this.data = [];
    this.start = 1;
    this.end = 50;
    this.getAllRemminders({ startCount: this.start, endCount: this.end, ...params });
  }
  getAllRemminders(params = null) {
    const sub = this.reminderService.getAllReminders(params).subscribe({
      next: (res) => {
        this.data = res['data'];
        this.count = res['count'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  deleteReminder(id: number) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.reminderService.deleteReminder(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllRemminders({ startCount: this.start, endCount: this.end });
          this.toaster.success('Deleted Successfully', 'Deleted');
          isub.unsubscribe();
        },
        error: (res) => {
          isub.unsubscribe();
        },
      });
  }

  sortData(sort: Sort) {
    this.data = this.sortService.getSortedData(
      sort,
      ['name', 'days', 'beforeAfter', 'dateType', 'startOnAction'],
      this.data
    );
  }

  getPrevious() {
    this.start = this.start - 50;
    this.end = this.end - 50;
    this.getAllRemminders({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }

  getNext() {
    this.start = this.end + 1;
    this.end = this.end + 50;
    this.getAllRemminders({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }
}
