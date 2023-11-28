import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter, Subscription, switchMap } from 'rxjs';
import { MessageService } from 'src/_services/message.service';
import { OrderService } from 'src/_services/rest/order.service';
import * as FileSaver from 'file-saver';
import { UpdateDateComponent } from './update-date/update-date.component';
import { PrintBrandingPurchaseComponent } from './print-branding-purchase/print-branding-purchase.component';
import { PermissionService } from 'src/_services/permission.service';
@Component({
  selector: 'app-branding-purchase',
  templateUrl: './branding-purchase.component.html',
  styleUrls: ['./branding-purchase.component.scss']
})
export class BrandingPurchaseComponent implements OnInit {

  form: FormGroup;
  sub: Subscription;
  data: any[] = [];
  selectedTemplates:any[]=[];
  quoteId: number = 0;
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private toaster: ToastrService,
    private messageService: MessageService,
    public ps: PermissionService,
    @Optional() private dialogRef: MatDialogRef<UpdateDateComponent>, private dialog: MatDialog) {
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
    this.getBranidngPurchaseOrders(this.quoteId);
  }
  getBranidngPurchaseOrders(id) {
    const subs = this.orderService.getBrandingPurchaseByQuote(id).subscribe({
      next: (res) => {
        this.form.patchValue({
          contactName: res['data'][0].contactName ? res['data'][0].contactName : '',
          customer: res['data'][0].customer ? res['data'][0].customer : '',
          contactNo: res['data'][0].contactNo ? res['data'][0].contactNo : '',
          quoteNo: res['data'][0].quoteNo ? res['data'][0].quoteNo : '',
          orderNo: res['data'][0].orderNo ? res['data'][0].orderNo : '',
        })
        this.data = res['data'];
        subs.unsubscribe();
      },
      error: (res) => {
        subs.unsubscribe();
      },
    });
  }
  sendBrandingPurchase() {
    const sub = this.orderService.sendBrandingPurchase(this.quoteId).subscribe({
      next: (res) => {
        this.toaster.success(
          `Purchase Order sent Successfully`,
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
    const DialogRef = this.dialog.open(PrintBrandingPurchaseComponent, {
      data: { id: this.quoteId },
      minWidth: '40%',
      height: '50%',
      disableClose: true
    });
  }

  deleteBrandingPurchase(id: number) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.orderService.deleteBrandingPurchase(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.toaster.success('Deleted Successfully', 'Deleted');
          isub.unsubscribe();
          this.getBranidngPurchaseOrders(this.quoteId);
        },
        error: (res) => {
          isub.unsubscribe();
        },
      });
  }
  updateDate(id) {
    const DialogRef = this.dialog.open(UpdateDateComponent, {
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
