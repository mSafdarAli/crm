import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-search-popup',
  templateUrl: './search-popup.component.html',
  styleUrls: ['./search-popup.component.scss']
})
export class SearchPopupComponent implements OnInit {
  form: FormGroup;
  constructor(@Optional() private dialogRef: MatDialogRef<SearchPopupComponent>, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      orderNo: [null],
      quoteNo: [null, [Validators.required]]
    })
  }

  ngOnInit(): void {
  }
  close() {
    this.dialogRef.close()
  }
  onSubmit() {
    this.dialogRef.close(this.form.value);
  }
}
