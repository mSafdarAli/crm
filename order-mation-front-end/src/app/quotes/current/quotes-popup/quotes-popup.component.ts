import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { QuoteService } from 'src/_services/rest/quote.service';

@Component({
  selector: 'app-quotes-popup',
  templateUrl: './quotes-popup.component.html',
  styleUrls: ['./quotes-popup.component.scss']
})
export class QuotesPopupComponent implements OnInit {
  form: FormGroup;
  quoteNo: number = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private toaster: ToastrService,
    @Optional() private dialogRef: MatDialogRef<QuotesPopupComponent>, private dialog: MatDialog, private formBuilder: FormBuilder, private quoteService: QuoteService,) {
    this.form = this.formBuilder.group({
      customerOrderNo: [null, [Validators.required]],
    })
    this.quoteNo = this.data.quoteNo;
  }

  ngOnInit(): void {
  }
  close() {
    this.dialogRef.close();
  }
  submit() {
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value);
      data.quoteNo = this.quoteNo;
      const sub = this.quoteService.createOrder(data).subscribe({
        next: (res) => {
          this.toaster.success('Quote Converted To Order Successfully', 'Converted');
          sub.unsubscribe();
          this.close();
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
}
