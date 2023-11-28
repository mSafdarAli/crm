import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as FileSaver from 'file-saver';
import { CommentService } from 'src/_services/rest/comment.service';
@Component({
  selector: 'app-view-attachment',
  templateUrl: './view-attachment.component.html',
  styleUrls: ['./view-attachment.component.scss']
})
export class ViewAttachmentComponent implements OnInit {

  Data: any[] = [];
  constructor(@Optional() private dialogRef: MatDialogRef<ViewAttachmentComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private commentService: CommentService) {
    if (this.data.quoteId) {
      const subs = this.commentService.getAttachments(this.data.quoteId).subscribe({
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
