import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/_services/rest/order.service';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {
  selectedTemplates: any[] = [];
  constructor(@Optional() private dialogRef: MatDialogRef<PrintComponent>,
  private orderService:OrderService,
  @Inject(MAT_DIALOG_DATA) private data,
  private toaster: ToastrService,
  ) { 
      const sub = this.orderService.printPurchase(this.data.id).subscribe({
        next: (res) => {
          this.selectedTemplates = res['data'];
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
  

  ngOnInit(): void {
  }
  close() {
    this.dialogRef.close()
  }
  print(link){
    FileSaver.saveAs(link);
  }
  getFileName(file){
    return file.split('|')[1]
  }
}
