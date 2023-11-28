import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap } from 'rxjs';
import { MessageService } from 'src/_services/message.service';
import { CustomerCategoriesService } from 'src/_services/rest/customerCategories.service';
import { SortService } from 'src/_services/sort.service';
import { NewCategoryComponent } from './new-category/new-category.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  data: [] = [];
  count: number = 0;
  start: number = 1;
  end: number = 50;
  search: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewCategoryComponent>,
    private dialog: MatDialog,
    private customerCategories: CustomerCategoriesService,
    private toaster: ToastrService,
    private messageService: MessageService,
    private sortService: SortService
  ) {
    this.search = this.formBuilder.group({
      search: [''],
    });
  }

  ngOnInit(): void {
    this.getCustomerCategories({ startCount: this.start, endCount: this.end });
  }
  newDialog(id = null) {
    const DialogRef = this.dialog.open(NewCategoryComponent, {
      data: { id: id },
      width: '80%',
      minHeight: '70%',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getCustomerCategories({
        startCount: this.start,
        endCount: this.end,
      });
      sub.unsubscribe();
    });
  }
  searchActionTypes(params) {
    this.data = [];
    this.getCustomerCategories({
      startCount: this.start,
      endCount: this.end,
      ...params,
    });
  }
  getCustomerCategories(params) {
    const sub = this.customerCategories
      .getCustomerCategories(params)
      .subscribe({
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

  deletecustomerscategories(id: number) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.customerCategories.delete(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getCustomerCategories({
            startCount: this.start,
            endCount: this.end,
          });
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
      ['code', 'description', 'discount'],
      this.data
    );
  }

  getPrevious() {
    this.start = this.start - 50;
    this.end = this.end - 50;
    this.getCustomerCategories({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }

  getNext() {
    this.start = this.end + 1;
    this.end = this.end + 50;
    this.getCustomerCategories({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }
}
