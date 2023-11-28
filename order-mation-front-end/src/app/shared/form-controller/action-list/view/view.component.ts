import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderService } from 'src/_services/rest/order.service';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  selectedTemplates: any[] = [];
  constructor(@Optional() private dialogRef: MatDialogRef<ViewComponent>,
    private orderService: OrderService,
    @Inject(MAT_DIALOG_DATA) private data,
    ) {
    const sub = this.orderService.viewAttachment(this.data.id).subscribe({
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

}
