import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { lookupdata } from 'src/_models/lookup';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { SizesService } from 'src/_services/rest/sizes.service';

@Component({
  selector: 'app-size-popup',
  templateUrl: './size-popup.component.html',
  styleUrls: ['./size-popup.component.scss'],
})
export class SizePopupComponent implements OnInit {
  SizeID: string = null;
  form: FormGroup;
  selectsortorder: lookupdata[] = [];
  selecttype: lookupdata[] = [];

  constructor(private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<SizePopupComponent>,
    private sizeService: SizesService,
    private toaster: ToastrService,
    private lookupService: LookUpService,
    @Inject(MAT_DIALOG_DATA) private data) {
    this.SizeID = this.data.id;
    this.selectsortorder = this.lookupService.sortOrder();
    this.form = this.formBuilder.group({
      sizeType: [null, Validators.required],
      sortOrder: [],
      name: [null, [Validators.maxLength(64)]],
      code: [null, [Validators.required, Validators.maxLength(32)]],
      description: [null, [Validators.required, Validators.maxLength(500)]],
      active: [true]
    });

    if (this.SizeID) {
      const sub = this.sizeService.getSingleSize(this.SizeID).subscribe({
        next: (res) => {
          this.form.patchValue({
            sizeType: res['data'].sizeType ? res['data'].sizeType : '',
            description: res['data'].description ? res['data'].description : '',
            name: res['data'].name ? res['data'].name : '',
            code: res['data'].code ? res['data'].code : '',
            sortOrder: res['data'].sortOrder ? res['data'].sortOrder : '',
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

  ngOnInit(): void {
    this.getSizesType();
  }

  close() {
    this.dialogRef.close();
  }

  getSizesType() {
    const sub = this.sizeService.getSizesType().subscribe({
      next: (res) => {
        this.selecttype = res;
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
      if (this.SizeID) {
        data.id = this.SizeID;
      }
      const sub = this.sizeService.createOrUpdateSizes(data)
        .subscribe({
          next: (res) => {
            this.toaster.success(
              `Sizes ${this.SizeID ? 'Updated' : 'Created'} Successfully`,
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
