import { Component, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NewSearchComponent } from 'src/app/quotes/search/new-search/new-search.component';

@Component({
  selector: 'app-new-override',
  templateUrl: './new-override.component.html',
  styleUrls: ['./new-override.component.scss']
})
export class NewOverrideComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, @Optional() private dialogRef: MatDialogRef<NewSearchComponent>) {
    this.form = this.formBuilder.group({
      emailaddress: [null, Validators.required],
      password: [null, Validators.required],
    });
  }
  ngOnInit(): void {
  }
  close() {
		this.dialogRef.close()
	}

}
