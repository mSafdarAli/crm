import { Component, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { MessageService } from 'src/_services/message.service';
import { ProductCategoryService } from 'src/_services/rest/productCategories.service';
import { SortService } from 'src/_services/sort.service';
import { CategoryPopupComponent } from './category-popup/category-popup.component';

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-categories.component.html',
  styleUrls: ['./product-categories.component.scss'],
})
export class ProductCategoriesComponent implements OnInit {
  data: [] = [];
  count: number = 0;
  start: number = 1;
  end: number = 50;
  search: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<CategoryPopupComponent>,
    private dialog: MatDialog,
    private productCategoryService: ProductCategoryService,
    private messageService: MessageService,
    private toaster: ToastrService,
    private sortService: SortService
  ) {
    this.search = this.formBuilder.group({
      search: ['']
    })
  }

  ngOnInit(): void {
    this.getProductCategory({ startCount: this.start, endCount: this.end });
  }
  newDialog( id = null ) {
    const DialogRef = this.dialog.open(CategoryPopupComponent, {
      data: { id: id },
      width: '80%',
      minHeight: '70%',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getProductCategory({ startCount: this.start, endCount: this.end });
      sub.unsubscribe();
    });
  }
  searchActionTypes(params) {
    this.data = [];
    this.start = 1;
    this.end = 50;
    this.getProductCategory({ startCount: this.start, endCount: this.end, ...params});
  }
  getProductCategory(params) {
    const sub = this.productCategoryService.getProductCategory(params).subscribe({
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

  deleteProductCategory(id: number) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.productCategoryService.delete(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getProductCategory({ startCount: this.start, endCount: this.end });
          this.toaster.success('Deleted Successfully', 'Deleted');
          isub.unsubscribe();
        },
        error: (res) => {
          isub.unsubscribe();
        },
      });
  }

  sortData(sort: Sort) {
    this.data = this.sortService.getSortedData(sort, [      
      "code",     
      "description",                   
      ], this.data);
  }

  getPrevious() {
    this.start = this.start - 50
    this.end = this.end - 50;    
    this.getProductCategory({ query: this.search.value.search, startCount: this.start, endCount: this.end });
  }

  getNext() {
    this.start = this.end + 1;
    this.end = this.end + 50;    
    this.getProductCategory({ query: this.search.value.search, startCount: this.start, endCount: this.end });
  }
}
