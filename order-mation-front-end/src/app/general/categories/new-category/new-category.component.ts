import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CustomerCategoriesService } from 'src/_services/rest/customerCategories.service';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.scss'],
})
export class NewCategoryComponent implements OnInit {
  form: FormGroup;
  customerCategoriesID: string = null;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewCategoryComponent>,
    private customerCategoriesService: CustomerCategoriesService,
    private toaster: ToastrService,
    @Inject(MAT_DIALOG_DATA) private data) {
    this.customerCategoriesID = this.data.id;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      code: [null, [Validators.required, Validators.maxLength(50)]],
      description: [null, [Validators.required, Validators.maxLength(100)]],
      discount: [null, Validators.required],
      active: [true]
    });

    if (this.customerCategoriesID) {
      const sub = this.customerCategoriesService
        .getSingleCustomerCategories(this.customerCategoriesID)
        .subscribe({
          next: (res) => {
            this.form.patchValue({
              code: res['data'].code ? res['data'].code.toString() : '',
              description: res['data'].description ? res['data'].description : '',
              discount: res['data'].discount ? res['data'].discount : '',
              active: res['data'].active ? res['data'].active : false,
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
      if (this.customerCategoriesID) {
        data.id = this.customerCategoriesID;
      }
      const sub = this.customerCategoriesService
        .createOrUpdateCustomersCategories(data)
        .subscribe({
          next: (res) => {
            this.toaster.success(
              `Category ${this.customerCategoriesID ? 'Updated' : 'Created'
              } Successfully`,
              'Success'
            );
            this.dialogRef.close();
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
}
