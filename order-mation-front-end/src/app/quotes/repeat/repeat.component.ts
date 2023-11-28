import { Component, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewRepeatComponent } from './new-repeat/new-repeat.component';

@Component({
  selector: 'app-repeat',
  templateUrl: './repeat.component.html',
  styleUrls: ['./repeat.component.scss']
})
export class RepeatComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, @Optional() private dialogRef: MatDialogRef<NewRepeatComponent>, private dialog: MatDialog) {
    this.form = this.formBuilder.group({
      quoteno: [null, Validators.required],
      orderno: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.newDialog();
  }
  newDialog() {
    const DialogRef = this.dialog.open(NewRepeatComponent, {
      // data: { filter_val: this.form.value.filter_val, filter_year: this.form.value.filter_year, dateData: item },
      minWidth: '35%',
      minHeight: '80%',
      disableClose: true,
    });
  }

}
