import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { lookupdata } from 'src/_models/lookup';
import { ImportService } from 'src/_services/rest/import.service';
import * as FileSaver from 'file-saver';
import { LookUpService } from 'src/_services/rest/lookup.service';
@Component({
  selector: 'app-new-export',
  templateUrl: './new-export.component.html',
  styleUrls: ['./new-export.component.scss']
})
export class NewExportComponent implements OnInit {
  selectSupplier: lookupdata[] = [];
  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewExportComponent>,
    private importService: ImportService,
    private lookupService: LookUpService) {
    const sub = this.lookupService.getSupplier({ active: true }).subscribe({
      next: res => {
        this.selectSupplier = res;
        sub.unsubscribe();
      },
      error: res => {
        sub.unsubscribe();
      }
    })
    this.form = this.formBuilder.group({
      supplier: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

  submit() {
    if (this.form.valid) {
      const sub = this.importService.getExcelBySupplier(this.form.value.supplier).subscribe({
        next: res => {
          FileSaver.saveAs(res['data']);
          this.close();
          sub.unsubscribe();
        },
        error: res => {
          sub.unsubscribe();
        }
      })
    }
  }

  close() {
    this.dialogRef.close()
  }
}
