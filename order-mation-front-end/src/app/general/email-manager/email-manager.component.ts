import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap } from 'rxjs';
import { MessageService } from 'src/_services/message.service';
import { EmailManagerService } from 'src/_services/rest/emailManager.service';
import { SortService } from 'src/_services/sort.service';
import { NewEmailComponent } from './new-email/new-email.component';

@Component({
  selector: 'app-email-manager',
  templateUrl: './email-manager.component.html',
  styleUrls: ['./email-manager.component.scss'],
})
export class EmailManagerComponent implements OnInit {
  data: [] = [];
  count: number = 0;
  start: number = 1;
  end: number = 50;
  search: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewEmailComponent>,
    private dialog: MatDialog,
    private emailManagerService: EmailManagerService,
    private toaster: ToastrService,
    private messageService: MessageService,
    private sortService: SortService
  ) {
    this.search = this.formBuilder.group({
      search: [''],
    });
  }

  ngOnInit(): void {
    this.getNotifications({ startCount: this.start, endCount: this.end });
  }
  newDialog(id = null) {
    const DialogRef = this.dialog.open(NewEmailComponent, {
      data: { id: id },
      width: '80%',
      height: '70%',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getNotifications({ startCount: this.start, endCount: this.end });
      sub.unsubscribe();
    });
  }
  searchActionTypes(params) {
    this.data = [];
    this.start = 1;
    this.end = 50;
    this.getNotifications({ startCount: this.start, endCount: this.end, ...params });
  }
  getNotifications(params = null) {
    const sub = this.emailManagerService.getNotifications(params).subscribe({
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

  deleteEmailManager(id: number) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.emailManagerService.delete(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getNotifications({ startCount: this.start, endCount: this.end });
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
      ['name', 'subject'],
      this.data
    );
  }

  getPrevious() {
    this.start = this.start - 50;
    this.end = this.end - 50;
    this.getNotifications({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }

  getNext() {
    this.start = this.end + 1;
    this.end = this.end + 50;
    this.getNotifications({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }
}
