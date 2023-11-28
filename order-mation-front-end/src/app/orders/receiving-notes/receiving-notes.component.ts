import { Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotesCommentsComponent } from 'src/app/shared/form-controller/notes-comments/notes-comments.component';
import { lookupdata } from 'src/_models/lookup';
import { OrderService } from 'src/_services/rest/order.service';
import { HistoryPopupComponent } from './history-popup/history-popup.component';

@Component({
  selector: 'app-receiving-notes',
  templateUrl: './receiving-notes.component.html',
  styleUrls: ['./receiving-notes.component.scss']
})
export class ReceivingNotesComponent implements OnInit, OnDestroy {
  isEditing: boolean = false;
  form: FormGroup;
  sub: Subscription;
  data: any[] = [];
  quoteId: number = 0;
  orderNo:number=0;
  qty: number = 0;
  shorts: number = 0;
  tableForm: FormGroup;
  selectUserList: lookupdata[] = [];
  constructor(private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<HistoryPopupComponent, NotesCommentsComponent>,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {
    this.selectUserList.push({ name: 'name', value: '1' }, { name: 'name', value: '2' }, { name: 'name', value: '3' });
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
    this.getReceivingNotes();
  }
  getReceivingNotes() {
    this.qty = 0;
    this.shorts = 0;
    const subs = this.orderService.receivingNotes(this.quoteId).subscribe({
      next: (res) => {
        this.form.patchValue({
          contactName: res['data'][0].contactName ? res['data'][0].contactName : '',
          customer: res['data'][0].customer ? res['data'][0].customer : '',
          contactNo: res['data'][0].contactNo ? res['data'][0].contactNo : '',
          quoteNo: res['data'][0].quoteNo ? res['data'][0].quoteNo : '',
          orderNo: res['data'][0].orderNo ? res['data'][0].orderNo : '',
        })
        this.orderNo = res['data'][0].orderNo;
        this.tableForm = this.formBuilder.group({
          receivings: this.formBuilder.array(res['data'].map(datum => this.generateDatumFormGroup(datum)))
        });
        this.data = res['data'];
        this.data.forEach((e) => {
          this.qty = this.qty + e.quantity;
          this.shorts = this.shorts + e.short;
        })
        subs.unsubscribe();
      },
      error: (res) => {
        subs.unsubscribe();
      },
    });
  }
  enableSection(disabled) {
    this.isEditing = true;
    const receivingFormGroup = (<FormArray>this.tableForm.get('receivings'));
    disabled ? receivingFormGroup.enable() : receivingFormGroup.disable();
  }
  private generateDatumFormGroup(datum) {
    return this.formBuilder.group({
      supplier: this.formBuilder.control({ value: datum.supplier, disabled: true }),
      product: this.formBuilder.control({ value: datum.product, disabled: true }),
      size: this.formBuilder.control({ value: datum.size, disabled: true }),
      weight: this.formBuilder.control({ value: datum.weight, disabled: true }),
      colour: this.formBuilder.control({ value: datum.colour, disabled: true }),
      quantity: this.formBuilder.control({ value: datum.quantity, disabled: true }),
      total: this.formBuilder.control({ value: datum.total, disabled: true }),
      short: this.formBuilder.control({ value: datum.short, disabled: true }),
      quoteDetailId: this.formBuilder.control({ value: datum.quoteDetailId, disabled: true }),
      quantityReceived: this.formBuilder.control({ value: datum.quantityReceived, disabled: true }),
      notes: this.formBuilder.control({ value: datum.notes, disabled: true }),
      invoiceNo: this.formBuilder.control({ value: datum.invoiceNo, disabled: true })
    });
  }
  history_popup(id) {
    const DialogRef = this.dialog.open(HistoryPopupComponent, {
      data: { id: id },
      width: '80%',
      height: '70%',
      disableClose: true
    });
  }
  comment_popup(id) {
    const DialogRef = this.dialog.open(NotesCommentsComponent, {
      data: { id: id, commentType: 'ReceivingNote',orderNo:this.orderNo },
      width: '80%',
      height: '90%',
      disableClose: true
    });
  }

  update() {
    this.isEditing = false;
    const data:any[]=[]
    this.tableForm.value.receivings.forEach(el => {
      if (el.quantityReceived != null) {
        data.push({
          quoteDetailId : el.quoteDetailId,
          quantityReceived : el.quantityReceived,
          invoiceNo : el.invoiceNo,
          notes : el.notes,
        })
      }
    });
    const sub = this.orderService.createReceiving(data).subscribe({
      next: res => {
        this.getReceivingNotes();
        sub.unsubscribe();
      }, error: res => {
        sub.unsubscribe();
      }
    });
  }

  cancel() {
    this.isEditing = false;
    this.getReceivingNotes();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
