import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PricingService } from 'src/_services/rest/pricing.service ';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent implements OnInit {
  extraPricesId: string = null;
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    private dialog: MatDialog,
    private pricingService : PricingService,
    private toaster: ToastrService
  ) {
    this.extraPricesId = this.data.id;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      code: ["Delivery Charge", [Validators.required, Validators.maxLength(64) ]],
      description: [null, [Validators.required , Validators.maxLength(500)]],
      unit: [null, [Validators.required]],
      price: [null, [Validators.required]],
      active: [true],
    });
    if (this.extraPricesId) {
      const sub = this.pricingService.getSingleExtraPrices(this.extraPricesId).subscribe({
        next: (res) => {
          this.form.patchValue({
            code: res['data'].code ? res['data'].code : '',
            description: res['data'].description ? res['data'].description : '',
            unit: (res['data'].unit || res['data'].unit == 0) ? res['data'].unit: '',
            price: (res['data'].price || res['data'].price == 0) ? res['data'].price : '',
            active: res['data'].active ? res['data'].active : true,
          });
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
  }

  
  close() {
    this.dialogRef.close();
  }


  onSubmit() {
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value);
      if (this.extraPricesId) {
        data.id = this.extraPricesId;
      }
      const sub = this.pricingService.createOrUpdateExtraPrices(data).subscribe(
        {
          next: (res) => {
            this.toaster.success(
              `Extra Price ${
                this.extraPricesId ? 'Updated' : 'Created'
              } Successfully`,
              'Success'
            );
            this.dialogRef.close();
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        }
      );
    }else{
      this.form.markAllAsTouched();
    }
  }
}
