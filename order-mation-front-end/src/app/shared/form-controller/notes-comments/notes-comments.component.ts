import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { lookupdata } from 'src/_models/lookup';
import * as FileSaver from 'file-saver';
import { CommentService } from 'src/_services/rest/comment.service';
import { ViewAttachmentComponent } from '../view-attachment/view-attachment.component';

@Component({
  selector: 'app-notes-comments',
  templateUrl: './notes-comments.component.html',
  styleUrls: ['./notes-comments.component.scss']
})
export class NotesCommentsComponent implements OnInit {
  form: FormGroup;
   quoteId: number;
   commentTypee : string;
  data: any[] = [];
  orderNo : number=0;
  quoteNo : number=0;
  taskNo:number=0;
  selectedTemplates: any[] = [];
  templates:any[]=[];
  moment = moment;
  commentType: lookupdata[] = [];
  constructor(private formBuilder: FormBuilder,
    private toaster: ToastrService,
    @Inject(MAT_DIALOG_DATA) private Data,
    private dialog: MatDialog,
    @Optional() private dialogRef: MatDialogRef<NotesCommentsComponent>,
    private commentService: CommentService,
  ) {
    console.log('type' , this.Data)
    this.quoteId = this.Data.id;
    this.commentTypee =this.Data.commentType;
    this.orderNo = this.Data.orderNo;
    this.quoteNo = this.Data.quoteNo;
    this.taskNo=this.Data.taskNo;
    this.form = this.formBuilder.group({
      commentText: [null, Validators.required],
      
    })
    
  }

  ngOnInit(): void {
    this.getComments(this.commentTypee,this.quoteId);
  }
  getComments(commentType,id) {
    const sub = this.commentService.getComments(commentType,id).subscribe({
      next: (res) => {
        this.data = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  onSubmit() {
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value);
      data.linkId = this.quoteId;
      data.commentType =this.commentTypee;
      const sub = this.commentService.createComments(data,this.templates).subscribe({
        next: (res) => {
          this.toaster.success(
            `Comment Added Successfully`,
            'Success'
          );
          this.form.reset();
          this.getComments(this.commentTypee,this.quoteId);
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
    else {
      this.form.markAllAsTouched();
    }
  }
  attachmentPopUp(id){
    const DialogRef = this.dialog.open(ViewAttachmentComponent, {
      data: { quoteId: id},
      width: '40%',
      height: '50%',
      disableClose: true
    });
  }
  selectTemplate(event) {
    const file = event.target.files[0];
    this.templates.push(file);
  }
  close() {
    this.dialogRef.close()
  }
}
