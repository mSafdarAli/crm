import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderService } from 'src/_services/rest/order.service';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-dispatch-popup',
  templateUrl: './dispatch-popup.component.html',
  styleUrls: ['./dispatch-popup.component.scss']
})
export class DispatchPopupComponent implements OnInit {
  quoteId: number = 0;
  history:any[]=[];
  constructor(@Optional() private dialogRef: MatDialogRef<DispatchPopupComponent>, @Inject(MAT_DIALOG_DATA) private data, private orderService: OrderService) {
    this.quoteId = this.data.id;
    if (this.quoteId) {
      const sub = this.orderService.dispatchHistory(this.quoteId).subscribe({
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
  printDispatchNote(documentNo){
    const sub = this.orderService.printDispatchNote(this.quoteId,documentNo).subscribe({
      next: res => {
        FileSaver.saveAs(res['data']);
        this.close();
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
