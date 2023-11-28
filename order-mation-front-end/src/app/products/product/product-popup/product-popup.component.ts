import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { lookupdata } from 'src/_models/lookup';
import { MessageService } from 'src/_services/message.service';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { ProductService } from 'src/_services/rest/product.service';

@Component({
  selector: 'app-product-popup',
  templateUrl: './product-popup.component.html',
  styleUrls: ['./product-popup.component.scss'],
})
export class ProductPopupComponent implements OnInit {
  form: FormGroup;
  ProductID: string = null;
  selectcategory: lookupdata[] = [];
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<ProductPopupComponent>,
    private messageService: MessageService,
    private toaster: ToastrService,
    private lookupService: LookUpService,
    private productService: ProductService,    
    @Inject(MAT_DIALOG_DATA) private data
  ) {    
    this.ProductID = this.data.id;
    this.getProductsCategory();
   

    this.form = this.formBuilder.group({
      productCategory: [null, Validators.required],
      code: [null, [Validators.required, Validators.maxLength(500)]],
      accountingCode: [null ,[ Validators.maxLength(50)]],
      description: [null, [Validators.required, Validators.maxLength(500)]],
      active:[true]
    });

    if (this.ProductID) {
      const sub = this.productService.getSingleProduct(this.ProductID).subscribe({
        next: (res) => {          
          this.form.patchValue({
            productCategory: res['data'].productCategory ? res['data'].productCategory : '',
            code: res['data'].code ? res['data'].code : '',
            accountingCode: res['data'].accountingCode ? res['data'].accountingCode : '',
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

  getProductsCategory() {
    const sub = this.lookupService.getProductsCategory().subscribe({
      next: (res) => {
        this.selectcategory = res;                
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  ngOnInit(): void {}
  close() {
    this.dialogRef.close();
  }
  onSubmit() {
    if (this.form.valid) {     
      const data = Object.assign({}, this.form.value);
      if (this.ProductID) {
        data.id = this.ProductID;
      }
      const sub = this.productService
        .createOrUpdateProducts(data)
        .subscribe({
          next: (res) => {
            this.toaster.success(
              `Product ${this.ProductID ? 'Updated' : 'Created'} Successfully`,
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
