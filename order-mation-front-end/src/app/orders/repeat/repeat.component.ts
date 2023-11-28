import { Component, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { RepeatOrderComponent } from './repeat-order/repeat-order.component';


@Component({
  selector: 'app-repeat',
  templateUrl: './repeat.component.html',
  styleUrls: ['./repeat.component.scss']
})
export class RepeatComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, @Optional() private dialogRef: MatDialogRef<RepeatOrderComponent>, private dialog: MatDialog) {
    this.form = this.formBuilder.group({
      quoteno: [null, Validators.required],
      orderno: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.newDialog();
  }
  newDialog() {
    const DialogRef = this.dialog.open(RepeatOrderComponent, {
      // data: { filter_val: this.form.value.filter_val, filter_year: this.form.value.filter_year, dateData: item },
      minWidth: '30%',
      minHeight: '80%',
      disableClose: true,
    });
  }
}
