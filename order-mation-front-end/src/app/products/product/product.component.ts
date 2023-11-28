import { Component, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { MessageService } from 'src/_services/message.service';
import { ProductService } from 'src/_services/rest/product.service';
import { SortService } from 'src/_services/sort.service';
import { ProductPopupComponent } from './product-popup/product-popup.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  data: [] = [];
  count: number = 0;
  start: number = 1;
  end: number = 50;
  search: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<ProductPopupComponent>,
    private dialog: MatDialog,
    private productService: ProductService,
    private messageService: MessageService,
    private toaster: ToastrService,
    private sortService: SortService
  ) {
    this.search = this.formBuilder.group({
      search: ['']
    })
  }
  ngOnInit(): void {
    this.getProducts({ startCount: this.start, endCount: this.end });
  }
  getPrevious() {
    this.start = this.start - 50
    this.end = this.end - 50;    
    this.getProducts({ query: this.search.value.search, startCount: this.start, endCount: this.end });
  }

  getNext() {
    this.start = this.end + 1;
    this.end = this.end + 50;    
    this.getProducts({ query: this.search.value.search, startCount: this.start, endCount: this.end });
  }
  searchActionTypes(params) {
    this.data = [];
    this.start = 1;
    this.end = 50;
    this.getProducts({ startCount: this.start, endCount: this.end, ...params });
  }
  newDialog(id = null) {
    const DialogRef = this.dialog.open(ProductPopupComponent, {
      data: { id: id },
      width: '80%',
      minHeight: '70%',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getProducts({ startCount: this.start, endCount: this.end });
      sub.unsubscribe();
    });
  }

  getProducts(params) {
    const sub = this.productService.getProducts(params).subscribe({
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

  deleteProducts(id: number) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.productService.delete(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getProducts({ startCount: this.start, endCount: this.end });
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
      "productCategory",
      "code",
      "description",
    ], this.data);
  }
}
