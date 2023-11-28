import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { lookupdata } from 'src/_models/lookup';
import { SettingService } from 'src/_services/rest/setting.service';

@Component({
  selector: 'app-new-setting',
  templateUrl: './new-setting.component.html',
  styleUrls: ['./new-setting.component.scss']
})
export class NewSettingComponent implements OnInit {
  settingID: string = null;
  url: string = null;
  form: FormGroup;
  selectsettings: lookupdata[] = [];

  constructor(private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewSettingComponent>,
    private dialog: MatDialog,
    private toaster: ToastrService,
    private settingService: SettingService,
    @Inject(MAT_DIALOG_DATA) private data) {
    this.settingID = this.data.id;
    this.url = this.data.url;
    this.selectsettings.push({ name: 'new', value: '1' }, { name: 'danish', value: '2' }, { name: 'danish', value: '3' });
    this.form = this.formBuilder.group({
      code: [null, [Validators.required, Validators.maxLength(32)]],
      description: [null, [Validators.required, Validators.maxLength(500)]],
      active: [true]
    });
  }

  ngOnInit(): void {
    if (this.settingID) {
      let changeUrl = null;
      if (['jobtype', 'obtainedfrom', "paymentterms"].indexOf(this.url) > -1) {
        changeUrl = "referenceCodes";
      }
      const sub = this.settingService
        .getsingleSetting((changeUrl != null) ? changeUrl : this.url, this.settingID)
        .subscribe({
          next: (res) => {
            this.form.patchValue({
              code: res['data'].code ? res['data'].code : (res['data'].key) ? res['data'].key : res['data'].name,
              description: res['data'].description ? res['data'].description : res['data'].value,
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

  newDialog() {
    const DialogRef = this.dialog.open(NewSettingComponent, {
      width: '70%',
      minHeight: '80%',
      disableClose: true
    });
  }

  close() {
    this.dialogRef.close()
  }

  submit() {
    if (['provinces'].indexOf(this.url) >= 0) {
      this.form.controls['code'].clearValidators();
      this.form.controls['code'].updateValueAndValidity()
    }
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value);
      if (['siteRoles'].indexOf(this.url) >= 0) {
        data.name = this.form.value.code;
      }
      if (['configurations'].indexOf(this.url) >= 0) {
        data.key = this.form.value.code;
        data.value = this.form.value.description;
      }
      if (this.settingID) {
        data.id = this.settingID;
      }
      if (['jobtype', 'obtainedfrom', "paymentterms"].indexOf(this.url) > -1) {
        data.type = this.url
      }

      const sub = this.settingService.createOrUpdateSetting(this.url, data).subscribe({
        next: (res) => {
          this.toaster.success(
            `Setting ${this.settingID ? 'Updated' : 'Created'
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
