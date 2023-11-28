import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PromptComponent>) { }

  public ngOnInit() {
    // TODO: Merge these params
    this.data.message = this.data.message || this.data.text;
    this.data.acceptBtnText = this.data.acceptBtnText || this.data.successBtnText;
    this.data.rejectBtnText = this.data.rejectBtnText || this.data.closeBtnText;
  }

}
