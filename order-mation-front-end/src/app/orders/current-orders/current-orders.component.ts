import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PermissionService } from 'src/_services/permission.service';
import { OrderService } from 'src/_services/rest/order.service';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SortService } from 'src/_services/sort.service';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { NewComponent } from 'src/app/workflow/complaints/current-complaints/new/new.component';
import { ExcelService } from 'src/_services/excel.service';
import { AcceptOrderComponent } from '../accept-order/accept-order.component';
import { NotesCommentsComponent } from 'src/app/shared/form-controller/notes-comments/notes-comments.component';
@Component({
  selector: 'app-current-orders',
  templateUrl: './current-orders.component.html',
  styleUrls: ['./current-orders.component.scss']
})
export class CurrentOrdersComponent implements OnInit {
  data: any[] = [];
  moment = moment;
  count: number = 0;
  start: number = 1;
  end: number = 50;
  search: FormGroup;
  fileName = 'Current Orders.xlsx';

  constructor(
    private dialog: MatDialog,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sortService: SortService,
    private toaster: ToastrService,
    public ps: PermissionService,
    private excelService: ExcelService) {
    this.search = this.formBuilder.group({
      search: ['']
    })
    this.getCurrentOrders({ startCount: this.start, endCount: this.end });
  }

  ngOnInit(): void { }

  searchOrders(params) {
    this.data = [];
    this.start = 1;
    this.end = 50;
    this.getCurrentOrders({ startCount: this.start, endCount: this.end, ...params });
  }

  getPrevious() {
    this.start = this.start - 50;
    this.end = this.end - 50;
    this.getCurrentOrders({ query: this.search.value.search, startCount: this.start, endCount: this.end });
  }

  getNext() {
    this.start = this.end + 1;
    this.end = this.end + 50;
    this.getCurrentOrders({ query: this.search.value.search, startCount: this.start, endCount: this.end });
  }

  newDialog(id, orderNo) {
    const DialogRef = this.dialog.open(NotesCommentsComponent, {
      data: { id: id, commentType: 'Order', orderNo: orderNo },
      width: '80%',
      height: '70%',
      disableClose: true
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
  getCurrentOrders(params) {
    const sub = this.orderService.getCurrentOrders(params).subscribe({
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
    this.router.navigate(['/quotes/new-quotes'], { queryParams: { quoteId: id, title: "View Order" , source:"Order"} });
  }

  repeatOrder(values) {
    this.router.navigate(['/quotes/new-quotes'], { queryParams: { quoteId: values, repeatOrder: true, title: "Repeat Order"  } });
  }

  acceptOrder(values) {
    const sub = this.orderService.acceptOrder(values).subscribe({
      next: res => {
        this.toaster.success(
          `Order Accepted Successfully`, 'Success');
        this.getCurrentOrders({ startCount: this.start, endCount: this.end });
        this.openAcceptOrder(res);
        sub.unsubscribe();
      }, error: res => {
        sub.unsubscribe();
      }
    });
  }

  openAcceptOrder(data) {
    const DialogRef = this.dialog.open(AcceptOrderComponent, {
      data: { result: data },
      width: '40%',
      height: '60%',
      disableClose: true
    });
  }

  sendOrder(quoteId, repEmail) {
    const sub = this.orderService.sendOrder({ quoteId: quoteId.toString(), mailFrom: repEmail }).subscribe({
      next: res => {
        this.toaster.success(
          `Mail Sent Successfully`, 'Success');
        sub.unsubscribe();
      }, error: res => {
        sub.unsubscribe();
      }
    });
  }

  sendArtWork(quoteId, repEmail) {
    const sub = this.orderService.sendArtWork({ quoteId: quoteId.toString(), mailFrom: repEmail }).subscribe({
      next: res => {
        this.toaster.success(
          `Mail Sent Successfully`, 'Success');
        sub.unsubscribe();
      }, error: res => {
        sub.unsubscribe();
      }
    });
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

  exportCurrentOrders(): void {
    const sub = this.excelService.exportCurrentOrder().subscribe({
      next: (res) => {
        FileSaver.saveAs(res['data']);
        this.toaster.success('Orders Exported Successfully', 'Success');
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
}
