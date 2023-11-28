import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { QuoteService } from 'src/_services/rest/quote.service';

@Component({
  selector: 'app-check-stock',
  templateUrl: './check-stock.component.html',
  styleUrls: ['./check-stock.component.scss']
})
export class CheckStockComponent implements OnInit {
  stockData: any[] = []
  constructor(private quotesService: QuoteService,
    private toaster: ToastrService,
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<CheckStockComponent>) { }

  ngOnInit(): void {
    this.checkStock();
  }

  checkStock() {
    const sub = this.quotesService.checkStock(this.data.queryParam).subscribe({
      next: (res) => {
        if (typeof res['data'] != 'string') {
          this.stockData = res['data'];
        } else {
          this.toaster.success(res['data'], 'Success');
        }
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  close(){
    this.dialogRef.close();
  }
}
