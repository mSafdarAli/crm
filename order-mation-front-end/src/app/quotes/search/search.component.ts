import { Component, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { NewSearchComponent } from './new-search/new-search.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, @Optional() private dialogRef: MatDialogRef<NewSearchComponent>, private dialog: MatDialog) {
    this.form = this.formBuilder.group({
      quoteno: [null, Validators.required],
      orderno: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.newDialog();
  }
  newDialog() {
    const DialogRef = this.dialog.open(NewSearchComponent, {
      // data: { filter_val: this.form.value.filter_val, filter_year: this.form.value.filter_year, dateData: item },
      minWidth: '35%',
      minHeight: '70%',
      disableClose: true,
    });
  }
}
