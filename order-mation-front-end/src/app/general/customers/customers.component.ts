import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap } from 'rxjs';
import { MessageService } from 'src/_services/message.service';
import { PermissionService } from 'src/_services/permission.service';
import { CustomerService } from 'src/_services/rest/customer.service';
import { SortService } from 'src/_services/sort.service';
import { NewCustomerComponent } from './new-customer/new-customer.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  data: [] = [];
  count: number = 0;
  start: number = 1;
  end: number = 50;
  search: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewCustomerComponent>,
    private dialog: MatDialog,
    private customerService: CustomerService,
    private toaster: ToastrService,
    private messageService: MessageService,
    private sortService: SortService,
    public ps: PermissionService
  ) {
    this.search = this.formBuilder.group({
      search: [''],
    });
  }

  ngOnInit(): void {
    this.getcustomers({ startCount: this.start, endCount: this.end });
  }
  searchActionTypes(params) {
    this.data = [];
    this.start = 1;
    this.end = 50;
    this.getcustomers({
      startCount: this.start,
      endCount: this.end,
      ...params,
    });
  }
  newDialog(id = null) {
    const DialogRef = this.dialog.open(NewCustomerComponent, {
      data: { id: id },
      width: '80%',
      height: '70%',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getcustomers({ startCount: this.start, endCount: this.end });
      sub.unsubscribe();
    });
  }
  getPrevious() {
    this.start = this.start - 50;
    this.end = this.end - 50;
    this.getcustomers({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }

  getNext() {
    this.start = this.end + 1;
    this.end = this.end + 50;
    this.getcustomers({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }

  getcustomers(params) {
    const sub = this.customerService.getcustomers(params).subscribe({
      next: (res) => {
        this.data = res['data'];
        this.count = res['count'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  deletecustomers(id: number) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.customerService.delete(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getcustomers({ startCount: this.start, endCount: this.end });
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
      [
        'code',
        'description',
        'tradingAs',
        'tradingAs',
        'telNo1',
        'emailAddress',
        'repName',
      ],
      this.data
    );
  }
}
