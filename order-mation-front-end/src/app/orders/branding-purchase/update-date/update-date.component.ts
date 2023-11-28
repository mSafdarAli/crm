import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Validators } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/_services/rest/order.service';
import { changeDateToApiFormat } from 'src/_services/utility';

@Component({
  selector: 'app-update-date',
  templateUrl: './update-date.component.html',
  styleUrls: ['./update-date.component.scss']
})
export class UpdateDateComponent implements OnInit {

  form: FormGroup;
  lineId: number = 0;
  constructor(private formBuilder: FormBuilder,
    private orderService: OrderService,
    private toaster: ToastrService,
    @Optional() private dialogRef: MatDialogRef<UpdateDateComponent>, @Inject(MAT_DIALOG_DATA) private data) {
    this.form = this.formBuilder.group({
      dueDate: [null, [Validators.required]],
      specialInstruction: [null, [Validators.required]]
    });
    this.lineId = this.data.id;
    if (this.lineId) {
      const sub = this.orderService.getSingleBrandingPurchase(this.lineId).subscribe({
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
      const sub = this.orderService.updateBrandingPurchase(data).subscribe({
        next: res => {
          this.toaster.success(
            `Branding Purchase Order Updated Successfully`,
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
