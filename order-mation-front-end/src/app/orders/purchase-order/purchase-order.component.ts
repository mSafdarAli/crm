import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter, Subscription, switchMap } from 'rxjs';
import { MessageService } from 'src/_services/message.service';
import { OrderService } from 'src/_services/rest/order.service';
import { DateComponent } from './date/date.component';
import * as FileSaver from 'file-saver';
import { PrintComponent } from './print/print.component';
import { PermissionService } from 'src/_services/permission.service';
@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {
  form: FormGroup;
  sub: Subscription;
  data: any[] = [];
  selectedTemplates: any[] = [];
  quoteId: number = 0;
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private toaster: ToastrService,
    private messageService: MessageService,
    public ps : PermissionService,
    @Optional() private dialogRef: MatDialogRef<DateComponent>, private dialog: MatDialog) {
    this.form = this.formBuilder.group({
      customer: [null],
      contactName: [null],
      contactNo: [null],
      orderNo: [null],
      quoteNo: [null]
    });
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.quoteId = params['id'];
    });
    this.getPurchaseOrders(this.quoteId);
  }
  getPurchaseOrders(id) {
    const subs = this.orderService.getPurchaseByQuote(id).subscribe({
      next: (res) => {
        if(res['data'].length >0){
          this.form.patchValue({
            contactName: res['data'][0].contactName ? res['data'][0].contactName : '',
            customer: res['data'][0].customer ? res['data'][0].customer : '',
            contactNo: res['data'][0].contactNo ? res['data'][0].contactNo : '',
            quoteNo: res['data'][0].quoteNo ? res['data'][0].quoteNo : '',
            orderNo: res['data'][0].orderNo ? res['data'][0].orderNo : '',
          })
          this.data = res['data'];
          subs.unsubscribe();
        }
        else{
          this.toaster.error('No Record Found')
        }
        },
      error: (res) => {
        subs.unsubscribe();
      },
    });
  }
  sendPurchase() {
    const sub = this.orderService.sendPurchase(this.quoteId).subscribe({
      next: (res) => {
        this.toaster.success(
          `Purchase Order Sent Successfully`,
          'Success'
        );
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  printPopup() {
    const DialogRef = this.dialog.open(PrintComponent, {
      data: { id: this.quoteId },
      minWidth: '40%',
      height: '50%',
      disableClose: true
    });
  }
  printPurchase() {
    const sub = this.orderService.printPurchase(this.quoteId).subscribe({
      next: (res) => {
        this.selectedTemplates = res['data'];
        this.selectedTemplates.forEach((e) => {
          FileSaver.saveAs(e);
        })
       
        this.toaster.success(
          `Purchase Order Downloaded Successfully`,
          'Success'
        );
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  deletePurchase(id: number) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.orderService.deletePurchase(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.toaster.success('Deleted Successfully', 'Deleted');
          isub.unsubscribe();
          this.getPurchaseOrders(this.quoteId);
        },
        error: (res) => {
          isub.unsubscribe();
        },
      });
  }
  popup(id) {
    const DialogRef = this.dialog.open(DateComponent, {
      data: { id: id },
      minWidth: '30%',
      minHeight: '80%',
      disableClose: true
    });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
