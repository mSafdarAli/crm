import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap } from 'rxjs';
import { MessageService } from 'src/_services/message.service';
import { SupplierService } from 'src/_services/rest/supplier.service';
import { SortService } from 'src/_services/sort.service';
import { NewSupplierComponent } from './new-supplier/new-supplier.component';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss'],
})
export class SuppliersComponent implements OnInit {
  data: [] = [];
  count: number = 0;
  start: number = 1;
  end: number = 50;
  search: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewSupplierComponent>,
    private dialog: MatDialog,
    private supplierService: SupplierService,
    private messageService: MessageService,
    private toaster: ToastrService,
    private sortService: SortService
  ) {
    this.search = this.formBuilder.group({
      search: [''],
    });
  }
  ngOnInit(): void {
    this.getSuppliers({ startCount: this.start, endCount: this.end });
  }
  newDialog(id = null) {
    const DialogRef = this.dialog.open(NewSupplierComponent, {
      data: { id: id },
      width: '80%',
      height: '70%',
      disableClose: true,
    });

    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getSuppliers({ startCount: this.start, endCount: this.end });
      sub.unsubscribe();
    });
  }
  searchActionTypes(params) {
    this.data = [];
    this.start = 1;
    this.end = 50;
    this.getSuppliers({
      startCount: this.start,
      endCount: this.end,
      ...params,
    });
  }
  getPrevious() {
    this.start = this.start - 50;
    this.end = this.end - 50;
    this.getSuppliers({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }

  getNext() {
    this.start = this.end + 1;
    this.end = this.end + 50;
    this.getSuppliers({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }

  getSuppliers(params = null) {
    const sub = this.supplierService.getSuppliers(params).subscribe({
      next: (res) => {
        this.data = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  deletesuppliers(id: number) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.supplierService.delete(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getSuppliers({ startCount: this.start, endCount: this.end });
          this.toaster.success('Deleted Successfully', 'Deleted');
          isub.unsubscribe();
        },
        error: (res) => {
          isub.unsubscribe();
        },
      });
  }

  sortData(sort: Sort) {
    this.data = this.sortService.getSortedData(
      sort,
      ['description', 'telNo1', 'telNo2', 'faxNo', 'email'],
      this.data
    );
  }
}
