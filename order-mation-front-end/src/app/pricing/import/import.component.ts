import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImportService } from 'src/_services/rest/import.service';
import { NewExportComponent } from './new-export/new-export.component';
import * as FileSaver from 'file-saver';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  type: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | null = null;
  form: FormGroup;

  constructor(private dialog: MatDialog,
    private importService: ImportService,
    private toaster: ToastrService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      filename: ['', Validators.required]
    });
  }

  newDialog() {
    const DialogRef = this.dialog.open(NewExportComponent, {
      width: '30%',
      minHeight: '80%',
      disableClose: true
    });
  }

  getProductBySupplier(supplierName: string) {
    const sub = this.importService.getSupplierProducts(supplierName).subscribe({
      next: res => {
        this.toaster.success(`Data Imported Successfully`, 'Success');
        sub.unsubscribe();
      },
      error: res => {
        sub.unsubscribe();
      }
    })
  }

  getTemplate() {
    const sub = this.importService.getExcelTemplate().subscribe({
      next: res => {
        FileSaver.saveAs(res['data']);
        this.toaster.success(`Template Downloaded Successfully`, 'Success');
        sub.unsubscribe();
      },
      error: res => {
        sub.unsubscribe();
      }
    })
  }

  uploadFile(event) {
    const file = event.target.files[0];
    const sub = this.importService.exportFile(this.form.value, file).subscribe({
      next: res => {
        this.toaster.success(`Data Imported Successfully`, 'Success');
        sub.unsubscribe();
      },
      error: res => {
        sub.unsubscribe();
      }
    })
  }
}
