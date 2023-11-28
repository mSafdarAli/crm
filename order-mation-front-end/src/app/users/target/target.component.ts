import { Optional } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap } from 'rxjs/operators';
import { MessageService } from 'src/_services/message.service';
import { SalesTargetService } from 'src/_services/rest/salesTarget.service';
import { UserService } from 'src/_services/rest/user.service';
import { SortService } from 'src/_services/sort.service';
import { NewTargetComponent } from './new-target/new-target.component';

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss'],
})
export class TargetComponent implements OnInit {
  data: [] = [];
  count: number = 0;
  start: number = 1;
  end: number = 50;
  search: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewTargetComponent>,
    private dialog: MatDialog,
    private saleTargetService: SalesTargetService,
    private messageService: MessageService,
    private toaster: ToastrService,
    private sortService: SortService
  ) {
    this.search = this.formBuilder.group({
      search: [''],
    });
  }

  ngOnInit(): void {
    this.getAllSalesTarget({ startCount: this.start, endCount: this.end });
  }

  searchActionTypes(params) {
    this.data = [];
    this.start = 1;
    this.end = 50;
    this.getAllSalesTarget({ startCount: this.start, endCount: this.end, ...params });
  }
  newDialog(id = null) {
    const DialogRef = this.dialog.open(NewTargetComponent, {
      data: { id: id },
      width: '80%',
      minHeight: '80%',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getAllSalesTarget({ startCount: this.start, endCount: this.end });
      sub.unsubscribe();
    });
  }

  getAllSalesTarget(params = null) {
    const sub = this.saleTargetService.getAllSalesTarget(params).subscribe({
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

  deleteSaleTarget(id: number) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.saleTargetService.delete(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllSalesTarget({ startCount: this.start, endCount: this.end });
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
      ['repName', 'year', 'month', 'week', 'budget'],
      this.data
    );
  }

  getPrevious() {
    this.start = this.start - 49;
    this.end = this.end - 50;    
    this.getAllSalesTarget({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }

  getNext() {
    this.start = this.end + 1;
    this.end = this.end + 50;    
    this.getAllSalesTarget({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }
}
