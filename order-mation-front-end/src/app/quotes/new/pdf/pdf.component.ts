import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { QuoteService } from 'src/_services/rest/quote.service';
import * as FileSaver from 'file-saver';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/_services/rest/order.service';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PDFComponent implements OnInit {
  type: '1' | null = null;
  title: string = 'Quote';
  orderLink : any;
  constructor(
    private dialogRef: MatDialogRef<PDFComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private toaster: ToastrService,
    private quotesService: QuoteService,
    private orderService:OrderService,
    private router: Router,
    private route: ActivatedRoute) {
    this.title = (this.data.from) ? this.data.from : 'Quote';
    console.log('data',this.data.data)
    if (this.data.from == 'Order') {
      const sub = this.orderService.printOrder(this.data.data.quoteId).subscribe({
        next: (res) => {
          this.orderLink = res['data'];
          // FileSaver.saveAs(res['data']);
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
  }

  ngOnInit(): void { }

  close() {
    this.dialogRef.close()
  }

  printPage() {
    FileSaver.saveAs((this.data.from=='Order')?this.orderLink:this.data.data.report);
    this.close();
    this.router.navigateByUrl((this.data.from)?'/orders/current-orders':'/quotes/current-quotes');
  }

  sendQuote() {
    if(this.data.from){
      const subs = this.orderService.sendOrder({ quoteId: this.data.data.quoteId, mailFrom: this.data.data.repEmail }).subscribe({
        next: (res) => {
          this.toaster.success('Order Sent Successfully', 'Sent');
          this.close();
          this.router.navigateByUrl('/orders/current-orders');
          subs.unsubscribe();
        },
        error: (res) => {
          subs.unsubscribe();
        },
      });
    }
    else{
      const sub = this.quotesService.sendQuote({ quoteId: this.data.data.quoteId, mailFrom: this.data.data.repEmail }).subscribe({
        next: (res) => {
          this.toaster.success('Quote Sent Successfully', 'Sent');
          this.close();
          this.router.navigateByUrl('/quotes/current-quotes');
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
    

    
  }
  
}
