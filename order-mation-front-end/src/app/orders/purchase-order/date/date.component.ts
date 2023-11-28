import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Validators } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/_services/rest/order.service';
import { changeDateToApiFormat } from 'src/_services/utility';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent implements OnInit {
  form: FormGroup;
  lineId: number = 0;
  constructor(private formBuilder: FormBuilder,
    private orderService: OrderService,
    private toaster: ToastrService,
    @Optional() private dialogRef: MatDialogRef<DateComponent>, @Inject(MAT_DIALOG_DATA) private data) {
    this.form = this.formBuilder.group({
      dueDate: [null, [Validators.required]],
      specialInstruction: [null, [Validators.required]]
    });
    this.lineId = this.data.id;
    if (this.lineId) {
      const sub = this.orderService.getSinglePurchase(this.lineId).subscribe({
        next: res => {
          this.form.patchValue({
            dueDate: res['data'].dueDate ? res['data'].dueDate : '',
            specialInstruction: res['data'].specialInstruction ? res['data'].specialInstruction : ''
          })
          sub.unsubscribe();
        }, error: res => {
          sub.unsubscribe();
        }
      });
    }
  }

  ngOnInit(): void {
  }
  submit() {
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value);
      data.id = this.lineId;
      data.dueDate=changeDateToApiFormat(this.form.value.dueDate);
      const sub = this.orderService.updatePurchase(data).subscribe({
        next: res => {
          this.toaster.success(
            `Purchase Order Updated Successfully`,
            'Success'
          );
          this.close();
          sub.unsubscribe();
        }, error: res => {
          sub.unsubscribe();
        }
      });
    }
    else {
      this.form.markAllAsTouched();
    }
  }
  close() {
    this.dialogRef.close()
  }
}
