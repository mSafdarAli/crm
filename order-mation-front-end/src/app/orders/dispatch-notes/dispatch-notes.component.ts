import { Component, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { NotesCommentsComponent } from 'src/app/shared/form-controller/notes-comments/notes-comments.component';
import { lookupdata } from 'src/_models/lookup';
import { OrderService } from 'src/_services/rest/order.service';
import { DispatchPopupComponent } from './dispatch-popup/dispatch-popup.component';


@Component({
  selector: 'app-dispatch-notes',
  templateUrl: './dispatch-notes.component.html',
  styleUrls: ['./dispatch-notes.component.scss']
})
export class DispatchNotesComponent implements OnInit {
  isEditing: boolean = false;
  form: FormGroup;
  tableForm : FormGroup;
  sub: Subscription;
  data : any[]=[];
  qty :  number=0;
  orderNo:number=0;
  shorts : number=0;
  quoteId : number = 0;
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private orderService : OrderService,
    @Optional() private dialogRef: MatDialogRef<NotesCommentsComponent , DispatchPopupComponent >, private dialog: MatDialog) {
    this.form = this.formBuilder.group({
      customer: [null],
      contactName: [null],
      contactNo: [null],
      orderNo: [null],
      quoteNo: [null],
      dispatchDate: [null],
    });
  }
  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.quoteId=params['id'];
    });
    this.getDispatchNotes();
    
  }
  getDispatchNotes(){
    this.qty=0;
    this.shorts = 0;
    const subs = this.orderService.dispatchNotes(this.quoteId).subscribe({
      next: (res) => {
        this.form.patchValue({
          contactName : res['data'][0].contactName ? res['data'][0].contactName : '', 
          customer : res['data'][0].customer ? res['data'][0].customer : '', 
          contactNo : res['data'][0].contactNo ? res['data'][0].contactNo : '', 
          quoteNo: res['data'][0].quoteNo ? res['data'][0].quoteNo : '', 
          orderNo : res['data'][0].orderNo ? res['data'][0].orderNo : '', 
          dispatchDate : res['data'][0].dispatchDate ? res['data'][0].dispatchDate : '',
        })
        this.orderNo = res['data'][0].orderNo;
        this.tableForm = this.formBuilder.group({
          dispatches: this.formBuilder.array(res['data'].map(datum => this.generateDatumFormGroup(datum)))
        });
        this.data = res['data'];
        this.data.forEach((e)=>{
          this.qty = this.qty+ e.quantity;

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
    const dispatchFormGroup = (<FormArray>this.tableForm.get('dispatches'));
    disabled ? dispatchFormGroup.enable() : dispatchFormGroup.disable();
  }
  private generateDatumFormGroup(datum) {
    return this.formBuilder.group({
      supplier: this.formBuilder.control({ value: datum.supplier, disabled: true }),
      product: this.formBuilder.control({ value: datum.product, disabled: true }),
      size: this.formBuilder.control({ value: datum.size, disabled: true }),
      weight: this.formBuilder.control({ value: datum.weight, disabled: true }),
      colour: this.formBuilder.control({ value: datum.colour, disabled: true }),
      quantity: this.formBuilder.control({ value: datum.quantity, disabled: true }),
      totalReceived: this.formBuilder.control({ value: datum.totalReceived, disabled: true }),
      quantityDispatched: this.formBuilder.control({ value: datum.quantityDispatched, disabled: true }),
      total: this.formBuilder.control({ value: datum.total, disabled: true }),
      short: this.formBuilder.control({ value: datum.short, disabled: true }),
      quoteDetailId: this.formBuilder.control({ value: datum.quoteDetailId, disabled: true }),
      notes: this.formBuilder.control({ value: datum.notes, disabled: true }),
    });
  }
  history_popup(id){
    const DialogRef = this.dialog.open(DispatchPopupComponent, {
			data: { id:this.quoteId},
			width: '80%',
			height: '80%',
			disableClose: true
		});
  }
  comment_popup(id ) {
    const DialogRef = this.dialog.open(NotesCommentsComponent, {
      data: {id : id , commentType:'DispatchNote',orderNo : this.orderNo},
      width: '80%',
      height: '70%',
      disableClose: true
    });
  }
  
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }


  update() {
    this.isEditing = false;
    const data: any[] = []
    this.tableForm.value.dispatches.forEach(el => {
      if (el.quantityDispatched != null) {
        data.push({
          quoteDetailId: el.quoteDetailId,
          quantityDispatched: el.quantityDispatched,
          dispatchDate: moment().format("YYYY-MM-DD"),
          notes: el.notes,
        })
      }
    });
   
    const sub = this.orderService.createDispatch(data).subscribe({
      next: res => {
        this.getDispatchNotes();
        sub.unsubscribe();
      }, error: res => {
        sub.unsubscribe();
      }
    });
  }
 
  cancel() {
    this.isEditing = false;
    this.getDispatchNotes();
  }
}
