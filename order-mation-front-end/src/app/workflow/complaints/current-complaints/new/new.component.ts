import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { lookupdata } from 'src/_models/lookup';
import { ComplaintService } from 'src/_services/rest/complaint.service';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { AttachmentsComponent } from '../../attachments/attachments.component';
@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  form: FormGroup;
  selectReason: lookupdata[] = [];
  quoteData: any[] = [];
  attachment: any[] = [];
  selectedTemplates: any[] = [];
  moment = moment;
  quoteId :number=0;
  constructor(private formBuilder: FormBuilder, @Optional() private dialogRef: MatDialogRef<NewComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private lookUpService: LookUpService,
    private complaintService: ComplaintService,
    private dialog: MatDialog,
    private toaster: ToastrService) {
    const sub = this.lookUpService.getReasons({ active: true }).subscribe({
      next: res => {
        this.selectReason = res,
          sub.unsubscribe();
      },
      error: res => {
        sub.unsubscribe();
      }
    });
    this.quoteId=this.data.quoteId;
    this.form = this.formBuilder.group({
      orderNo: [],
      reasonId: [null, [Validators.required]],
      quoteNo:[],
      notes: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.data.quoteId) {
      console.log(this.data)
      const sub = this.complaintService.getComplaintsByQuoteNo(this.quoteId).subscribe({
        next: res => {
          this.form.patchValue({
            orderNo: this.data.orderNo ? this.data.orderNo:'',
            quoteNo: this.data.quoteNo ? this.data.quoteNo :'',
          })
          this.quoteData = res['data'];
          sub.unsubscribe();
        },
        error: res => {
          sub.unsubscribe();
        }
      })
    }
  }

  attachmentPopUp(id) {
    const DialogRef = this.dialog.open(AttachmentsComponent, {
      data: { quoteId: id},
      width: '40%',
      height: '50%',
      disableClose: true
    });
  }
  imageUpload(event) {
    const file = event.target.files[0];
    this.attachment.push(file);
  }
  removeFile(file) {
    const ind = this.attachment.indexOf(file);
    this.attachment.splice(ind, 1);
  }
  close() {
    this.dialogRef.close()
  }

  submit() {
    if (this.form.valid) {
      if (this.data.status == 'Resolved'){
        const data = Object.assign({}, this.form.value);
        data.attachments = this.attachment;
        data.quoteId = this.data.quoteId;
        const sub = this.complaintService.resolveComplaint(data).subscribe({
          next: (res) => {
            this.toaster.success('Complaint Resolved Successfully', 'Success');
            this.dialogRef.close();
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }else{
        const data = Object.assign({}, this.form.value);
        data.attachments = this.attachment;
        data.quoteId = this.data.quoteId;
        const sub = this.complaintService.createComplaint(data).subscribe({
          next: (res) => {
            this.toaster.success('Complaint Created Successfully', 'Success');
            this.dialogRef.close();
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
}
