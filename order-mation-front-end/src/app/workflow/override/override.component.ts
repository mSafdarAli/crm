import { Component, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { NewOverrideComponent } from './new-override/new-override.component';

@Component({
  selector: 'app-override',
  templateUrl: './override.component.html',
  styleUrls: ['./override.component.scss']
})
export class OverrideComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, @Optional() private dialogRef: MatDialogRef<NewOverrideComponent>, private dialog: MatDialog) {
    this.form = this.formBuilder.group({
      quoteno: [null, Validators.required],
      orderno: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.newDialog();
  }
  newDialog() {
    const DialogRef = this.dialog.open(NewOverrideComponent, {
      // data: { filter_val: this.form.value.filter_val, filter_year: this.form.value.filter_year, dateData: item },
      width: '30%',
      minHeight: '80%',
      disableClose: true,
    });
  }

}
