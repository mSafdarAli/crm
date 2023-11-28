import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { lookupdata } from 'src/_models/lookup';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { QuoteService } from 'src/_services/rest/quote.service';
import { CheckStockComponent } from '../check-stock/check-stock.component';
import { ImagePreviewComponent } from '../image-preview/image-preview.component';
@Component({
  selector: 'app-search-products',
  templateUrl: './search-products.component.html',
  styleUrls: ['./search-products.component.scss']
})
export class SearchProductsComponent implements OnInit {
  data: any[] = [];
  count: number = 0;
  start: number = 1;
  end: number = 50;
  search: FormGroup;
  imgUrl: boolean = false;
  selectSupplier: lookupdata[] = [];

  constructor(private formBuilder: FormBuilder,
    private quotesService: QuoteService,
    private dialogRef: MatDialogRef<SearchProductsComponent>,
    private dialog: MatDialog,
    private toaster: ToastrService,
    private lookupService: LookUpService) {
      this.search = this.formBuilder.group({
        query: [''],
        supplier: [''],
        productCategory: [''],
        code: [''],
        description: [''],
      })
      
  }
  
  ngOnInit(): void {
    this.getProductSearch({ startCount: this.start, endCount: this.end });
  }
  
  close() {
    this.dialogRef.close()
  }

  getPrevious() {
    this.start = this.start - 50;
    this.end = this.end - 50;
    this.getProductSearch({ query: this.search.value.query, startCount: this.start, endCount: this.end });
  }

  getNext() {
    this.start = this.end + 1;
    this.end = this.end + 50;
    this.getProductSearch({ query: this.search.value.query, startCount: this.start, endCount: this.end });
  }

  searchProduct(params) {
    this.data = [];
    this.start = 1;
    this.end = 50;
    this.getProductSearch({ startCount: this.start, endCount: this.end, ...params });
  }

  getProductSearch(params) {
    const sub = this.quotesService.getProductSearch(params).subscribe({
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

  record(params) {
    
    this.dialogRef.close(params);
  }

  checkStock(params) {
    const DialogRef = this.dialog.open(CheckStockComponent, {
      data: { queryParam: params },
      width: '70%',
      height: '75%',
      disableClose: true,
    });
  }

  openDialog(params) {
    const DialogRef = this.dialog.open(CheckStockComponent, {
      data: { queryParam: params },
      width: '70%',
      height: '75%',
      disableClose: true,
    });
  }

  imagePreview(id) {
    const DialogRef = this.dialog.open(ImagePreviewComponent, {
      data: { id: id },
      width: '30%',
      minHeight: '50%',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.imgUrl = res;
      sub.unsubscribe();
    });
  }
}
