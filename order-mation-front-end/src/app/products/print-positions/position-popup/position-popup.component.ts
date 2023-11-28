import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { lookupdata } from 'src/_models/lookup';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { PositionService } from 'src/_services/rest/positions.service';
@Component({
  selector: 'app-position-popup',
  templateUrl: './position-popup.component.html',
  styleUrls: ['./position-popup.component.scss']
})
export class PositionPopupComponent implements OnInit {
  positionID: string = null;
  form: FormGroup;
  selectgroup: lookupdata[] = [];

  constructor(private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<PositionPopupComponent>,
    private lookupService: LookUpService,
    @Inject(MAT_DIALOG_DATA) private data,
    private positionService: PositionService,
    private toaster: ToastrService) {
    this.positionID = this.data.id;
    this.selectgroup.push({ name: 'new', value: '1' }, { name: 'danish', value: '2' }, { name: 'danish', value: '3' });
    this.form = this.formBuilder.group({
      group: [null, Validators.required],
      code: [null, [Validators.required, Validators.maxLength(32)]],
      description: [null, [Validators.required, Validators.maxLength(500)]],
      active: [true]
    })
  }

  ngOnInit(): void {
    this.getGroups();
    if (this.positionID) {
      const sub = this.positionService.getSingleColour(this.positionID).subscribe({
        next: (res) => {
          this.form.patchValue({
            group: res['data'].group ? res['data'].group : '',
            description: res['data'].description ? res['data'].description : '',
            code: res['data'].code ? res['data'].code : '',
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

  getGroups() {
    const sub = this.lookupService.getGroups().subscribe({
      next: (res) => {
        this.selectgroup = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  close() {
    this.dialogRef.close()
  }

  submit() {
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value);
      if (this.positionID) {
        data.id = this.positionID;
      }
      const sub = this.positionService
        .createOrUpdatePosition(data)
        .subscribe({
          next: (res) => {
            this.toaster.success(
              `Position ${this.positionID ? 'Updated' : 'Created'} Successfully`,
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
