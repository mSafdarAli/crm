import { Component, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import { PermissionService } from 'src/_services/permission.service';
import { OrderService } from 'src/_services/rest/order.service';
import { SortService } from 'src/_services/sort.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExcelService } from 'src/_services/excel.service';
import { ToastrService } from 'ngx-toastr';
import { NotesCommentsComponent } from 'src/app/shared/form-controller/notes-comments/notes-comments.component';
import { NewComponent } from 'src/app/workflow/complaints/current-complaints/new/new.component';
import { QuoteService } from 'src/_services/rest/quote.service';


@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  data: any[] = [];
  moment = moment;
  count: number = 0;
  start: number = 1;
  end: number = 50;
  search: FormGroup;
  fileName = 'Order History.xlsx';
  constructor(@Optional() private dialogRef: MatDialogRef<NotesCommentsComponent>,
    private dialog: MatDialog,
    private orderService: OrderService,
    private sortService: SortService,
    private router: Router,
    public ps: PermissionService,
    private formBuilder: FormBuilder,
    private excelService: ExcelService,
    private quoteService: QuoteService,
    private toaster: ToastrService) {
    this.search = this.formBuilder.group({
      search: ['']
    })
    this.getOrdersHistory({ startCount: this.start, endCount: this.end });
  }

  ngOnInit(): void {

  }
  searchOrderHistory(params) {
    this.data = [];
    this.start = 1;
    this.end = 50;
    this.getOrdersHistory({ startCount: this.start, endCount: this.end, ...params });
  }
  newDialog(id, orderNo) {
    const DialogRef = this.dialog.open(NotesCommentsComponent, {
      data: { id: id, commentType: 'Order', orderNo: orderNo },
      width: '80%',
      height: '70%',
      disableClose: true
    });
  }

  getOrdersHistory(params) {
    const sub = this.orderService.getOrdersHistory(params).subscribe({
      next: res => {
        this.data = res['data'];
        this.count = res['count'];
        sub.unsubscribe();
      }, error: res => {
        sub.unsubscribe();
      }
    });
  }
  viewOrder(id) {
    this.router.navigate(['/quotes/new-quotes'], { queryParams: { quoteId: id, title: "View Order" , source:"Order" } });
  }
  repeatOrder(values) {
    this.router.navigate(['/quotes/new-quotes'], { queryParams: { quoteId: values, repeatOrder: true, title: "Repeat Order" } });
  }
  // reOpenOrder(values) {
  //   this.router.navigate(['/quotes/new-quotes'], { queryParams: { quoteId: values, reOpenOrder: true } });
  // }

  reOpenOrder(id) {
    const sub = this.quoteService.reOpenQuote(id).subscribe({
      next: res => {
        this.toaster.success('Order Re-Opened Successfully', 'Status');
        this.getOrdersHistory({ startCount: this.start, endCount: this.end });
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
    // this.router.navigate(['/quotes/new-quotes'], { queryParams: { quoteId: values, reOpenQuote: true, title: "Re-Open Quote" } });

  }

  getPrevious() {
    this.start = this.start - 50;
    this.end = this.end - 50;
    this.getOrdersHistory({ query: this.search.value.search, startCount: this.start, endCount: this.end });
  }

  getNext() {
    this.start = this.end + 1;
    this.end = this.end + 50;
    this.getOrdersHistory({ query: this.search.value.search, startCount: this.start, endCount: this.end });
  }

  sortData(sort: Sort) {
    this.data = this.sortService.getSortedData(
      sort,
      ["orderNo",
        "quoteDate",
        "sales",
        "jobStatus",
        "customer",
        "jobName",
        "art",
        "accounts",
        "production",
        "finishing",
        "dispatch",
        "contactName",
        "repName",
        "packing"],
      this.data
    );
  }

  exportOrderHistory(): void {
    const sub = this.excelService.exportOrderHistory().subscribe({
      next: (res) => {
        FileSaver.saveAs(res['data']);
        this.toaster.success('Order History Exported Successfully', 'Success');
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  complaints(id, orderNo, quoteNo) {
    const DialogRef = this.dialog.open(NewComponent, {
      data: { quoteId: id, from: 'Order', orderNo: orderNo, quoteNo: quoteNo },
      width: '80%',
      height: '70%',
      disableClose: true
    });
  }
}
