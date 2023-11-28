import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/_services/rest/order.service';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-print-branding-purchase',
  templateUrl: './print-branding-purchase.component.html',
  styleUrls: ['./print-branding-purchase.component.scss']
})
export class PrintBrandingPurchaseComponent implements OnInit {
  selectedTemplates: any[] = [];
  constructor(@Optional() private dialogRef: MatDialogRef<PrintBrandingPurchaseComponent>,
    private orderService: OrderService,
    @Inject(MAT_DIALOG_DATA) private data,
    private toaster: ToastrService,) {
    const sub = this.orderService.printBrandingPurchase(this.data.id).subscribe({
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
  print(link) {
    FileSaver.saveAs(link);
  }
  close() {
    this.dialogRef.close()
  }
  getFileName(file) {
    return file.split('|')[1]
  }
}
