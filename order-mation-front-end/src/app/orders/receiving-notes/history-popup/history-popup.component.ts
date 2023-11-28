import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderService } from 'src/_services/rest/order.service';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-history-popup',
  templateUrl: './history-popup.component.html',
  styleUrls: ['./history-popup.component.scss']
})
export class HistoryPopupComponent implements OnInit {
  quoteId : number = null;
  history : any[] = [];
  constructor(@Optional() private dialogRef: MatDialogRef<HistoryPopupComponent> ,  @Inject(MAT_DIALOG_DATA) private data , private orderService : OrderService) { 
    this.quoteId = this.data.id;
    if(this.quoteId){
      const sub = this.orderService.receivinghistory(this.quoteId).subscribe({
        next: res => {
          this.history = res['data'];
          
          sub.unsubscribe();
        }, error: res => {
          sub.unsubscribe();
        }
      });
    }
  }

  ngOnInit(): void {
  }
  printReceivingNote(documentNo){
    const sub = this.orderService.printReceivingNote(this.quoteId,documentNo).subscribe({
      next: res => {
        FileSaver.saveAs(res['data']);
        sub.unsubscribe();
      }, error: res => {
        sub.unsubscribe();
      }
    });
  }

  close() {
    this.dialogRef.close()
  }
}
