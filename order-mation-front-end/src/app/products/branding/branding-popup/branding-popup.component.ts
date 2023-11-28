import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'src/_services/message.service';
import { BrandingService } from 'src/_services/rest/branding.service';

@Component({
  selector: 'app-branding-popup',
  templateUrl: './branding-popup.component.html',
  styleUrls: ['./branding-popup.component.scss'],
})
export class BrandingPopupComponent implements OnInit {
  form: FormGroup;
  BrandingID: string = null;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<BrandingPopupComponent>,
    private messageService: MessageService,
    private toaster: ToastrService,
    private brandingService: BrandingService,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.BrandingID = this.data.id;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      code: [null, [Validators.required, Validators.maxLength(32)]],
      description: [null, [Validators.required, Validators.maxLength(500)]],
      name: [null, [Validators.required, Validators.maxLength(64)]],
      active: [true, Validators.required],
    });

    if (this.BrandingID) {
      const sub = this.brandingService.getSingleBranding(this.BrandingID).subscribe({
        next: (res) => {          
          this.form.patchValue({            
            code: res['data'].code ? res['data'].code : '',           
            description: res['data'].description ? res['data'].description : '',          
            name: res['data'].name ? res['data'].name : '',          
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
      if (this.BrandingID) {
      data.id = this.BrandingID;
      }
      const sub = this.brandingService
        .createOrUpdateBranding(data)
        .subscribe({
          next: (res) => {
            this.toaster.success(
              `Branding ${this.BrandingID ? 'Updated' : 'Created'} Successfully`,
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
