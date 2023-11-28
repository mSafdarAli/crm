import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'src/_services/message.service';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { ProductService } from 'src/_services/rest/product.service';
import { ProductCategoryService } from 'src/_services/rest/productCategories.service';

@Component({
  selector: 'app-category-popup',
  templateUrl: './category-popup.component.html',
  styleUrls: ['./category-popup.component.scss'],
})
export class CategoryPopupComponent implements OnInit {
  form: FormGroup;
  CategoryID: string = null;

  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<CategoryPopupComponent>,
    private messageService: MessageService,
    private toaster: ToastrService,
    private lookupService: LookUpService,
    private productCategoryService: ProductCategoryService,
    @Inject(MAT_DIALOG_DATA) private data
  ) {    
    this.CategoryID = this.data.id;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      code: [null, [Validators.required, Validators.maxLength(100)]],
      description: [null, [Validators.required, Validators.maxLength(500)]],
      active:[true]
    });

    if (this.CategoryID) {
      const sub = this.productCategoryService.getSingleProductCategory(this.CategoryID).subscribe({
        next: (res) => {          
          this.form.patchValue({            
            code: res['data'].code ? res['data'].code : '',           
            description: res['data'].description ? res['data'].description : '',          
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
      if (this.CategoryID) {
      data.id = this.CategoryID;
      }
      const sub = this.productCategoryService
        .createOrUpdateProductCategory(data)
        .subscribe({
          next: (res) => {
            this.toaster.success(
              `Product Category ${this.CategoryID ? 'Updated' : 'Created'} Successfully`,
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
