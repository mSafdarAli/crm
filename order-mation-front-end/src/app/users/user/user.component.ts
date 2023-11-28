import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap } from 'rxjs/operators';
import { User } from 'src/_models';
import { MessageService } from 'src/_services/message.service';
import { UserService } from 'src/_services/rest/user.service';
import { SortService } from 'src/_services/sort.service';

import { NewComponent } from './new/new.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  data: any[] = [];
  singleUser: User;
  count: number = 0;
  start: number = 1;
  end: number = 50;
  search: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewComponent>,
    private dialog: MatDialog,
    private _userService: UserService,
    private messageService: MessageService,
    private toaster: ToastrService,
    private sortService: SortService
  ) {
    this.search = this.formBuilder.group({
      search: [''],
    });
  }

  ngOnInit(): void {
    this.getAllUsers({ startCount: this.start, endCount: this.end });
  }
  searchActionTypes(params) {
    this.data = [];
    this.start = 1;
    this.end = 50;
    this.getAllUsers({ startCount: this.start, endCount: this.end, ...params });
  }
  newDialog(id = null) {
    const DialogRef = this.dialog.open(NewComponent, {
      data: { id: id },
      width: '80%',
      height: '70%',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getAllUsers({ startCount: this.start, endCount: this.end });
      sub.unsubscribe();
    });
  }
  getAllUsers(params = null) {
    const sub = this._userService.getAllUsers(params).subscribe({
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

  deleteUser(id: number) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this._userService.deleteUser(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllUsers({ startCount: this.start, endCount: this.end });
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
      ['firstName', 'lastName', 'userName', 'contactNumber', 'emailAddress'],
      this.data
    );
  }

  getPrevious() {
    this.start = this.start - 50;
    this.end = this.end - 50;    
    this.getAllUsers({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }

  getNext() {
    this.start = this.end + 1;
    this.end = this.end + 50;    
    this.getAllUsers({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }
}
