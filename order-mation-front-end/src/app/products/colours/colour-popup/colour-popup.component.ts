import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { lookupdata } from 'src/_models/lookup';
import { ColoursService } from 'src/_services/rest/colours.service';

@Component({
  selector: 'app-colour-popup',
  templateUrl: './colour-popup.component.html',
  styleUrls: ['./colour-popup.component.scss'],
})
export class ColourPopupComponent implements OnInit {
  form: FormGroup;
  ColourID: string = null;
  selecttype: lookupdata[] = [];
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<ColourPopupComponent>,
    private dialog: MatDialog,
    private colourService: ColoursService,
    @Inject(MAT_DIALOG_DATA) private data,
    private toaster: ToastrService
  ) {
    this.ColourID = this.data.id;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      colourType: [null,[Validators.required]],
      code: [null, [Validators.required, Validators.maxLength(32)]],
      description: [null, [Validators.required, Validators.maxLength(500)]],
      active: [true],
    });
    if (this.ColourID) {
      const sub = this.colourService.getSingleColour(this.ColourID).subscribe({
        next: (res) => {
          this.form.patchValue({
            code: res['data'].code ? res['data'].code : '',
            description: res['data'].description ? res['data'].description : '',
            colourType: res['data'].colourType ? res['data'].colourType : '',
            active: res['data'].active ? res['data'].active : false,
          });
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
    this.getColoursType();
  }
  close() {
    this.dialogRef.close();
  }
  getColoursType() {
    const sub = this.colourService.getColoursType().subscribe({
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
      if (this.ColourID) {
        data.id = this.ColourID;
      }
      const sub = this.colourService.createOrUpdateColours(data).subscribe({
        next: (res) => {
          this.toaster.success(
            `Colours ${this.ColourID ? 'Updated' : 'Created'} Successfully`,
            'Success'
          );
          this.dialogRef.close();
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
