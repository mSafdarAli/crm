import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComplaintService } from 'src/_services/rest/complaint.service';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent implements OnInit {
  Data: any[] = [];
  constructor(@Optional() private dialogRef: MatDialogRef<AttachmentsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private complaintService: ComplaintService,) {
    if (this.data.quoteId) {
      const subs = this.complaintService.viewAttachments(this.data.quoteId).subscribe({
        next: (res) => {
          this.Data = res['data']
          subs.unsubscribe();
        },
        error: (res) => {
          subs.unsubscribe();
        },
      });

    }
  }

  ngOnInit(): void {

  }
  printAttachment(link) {
    FileSaver.saveAs(link);
  }
  close() {
    this.dialogRef.close()
  }
}
