import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter, Subscription, switchMap } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { OrderService } from 'src/_services/rest/order.service';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'src/_services/message.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { OverRideComponent } from 'src/app/shared/form-controller/over-ride/over-ride.component';
import { NotesCommentsComponent } from 'src/app/shared/form-controller/notes-comments/notes-comments.component';
import { ViewComponent } from './view/view.component';

@Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.scss']
})
export class ActionListComponent implements OnInit {
  isEditing: boolean = false;
  enableEditIndex = null;
  form: FormGroup;
  tableForm: FormGroup;
  orderNo: number = 0;
  moment = moment;
  quoteNo: number = 0;
  templates: any[] = [];
  overRide: boolean = false;
  selectUserList: lookupdata[] = [];
  sub: Subscription;
  quoteId: number = 0;
  data: any[] = [];
  dataSource: any = null;
  selectedTemplates: any[] = [];
  selectedValue: any[] =[];
  constructor(private formBuilder: FormBuilder,
    private orderService: OrderService,
    private toaster: ToastrService,
    private messageService: MessageService,
    @Optional() private dialogRef: MatDialogRef<NotesCommentsComponent>,
    private dialog: MatDialog,
    private route: ActivatedRoute) {
    this.form = this.formBuilder.group({
      customer: [null, Validators.required],
      contactName: [null, Validators.required],
      contactNo: [null, Validators.required],
      orderNo: [null, Validators.required],
      quoteNo: [null, Validators.required],
      product: [null]
    });
    this.tableForm = this.formBuilder.group({
      actionName: [null],
      notes: [''],
      description: [''],
      extraFieldDescription: [''],
      actionDate: [moment().format("YYYY-MM-DD HH:mm")]
    });

  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.quoteId = params['id'];
    });
    this.getActions(this.quoteId);
    this.getUsers();
  }


  overRide_popup() {
    const DialogRef = this.dialog.open(OverRideComponent, {
      data: { overrideFunction: 'OverrideActionList' },
      minWidth: '30%',
      minHeight: '30%',
      disableClose: true
    });
    const sub = DialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.overRide = result;
      }
      sub.unsubscribe();
    });
  }

  getActions(id) {
    const subs = this.orderService.getActions(this.quoteId).subscribe({
      next: (res) => {
        this.orderNo = parseInt(res['data'].orderNo);
        this.form.patchValue({
          customer: res['data'].customer ? res['data'].customer : '',
          contactName: res['data'].contactName ? res['data'].contactName : '',
          contactNo: res['data'].contactNo ? res['data'].contactNo : '',
          orderNo: res['data'].orderNo ? res['data'].orderNo : '',
          quoteNo: res['data'].quoteNo ? res['data'].quoteNo : '',
          product: res['data'].product ? res['data'].product : '',


        })
        this.quoteNo = res['data'].quoteNo;
        this.data = res['data'].actions;
        this.dataSource = res['data'].actions;
        this.getUserNameAfterSave(res['data'].actions)
        subs.unsubscribe();
      },
      error: (res) => {
        subs.unsubscribe();
      },
    });
  }
  reSendAction(id) {
    const subs = this.orderService.reSendAction(id).subscribe({
      next: (res) => {
        this.toaster.success(
          `Mail Sent Successfully`,
          'Success'
        );
        subs.unsubscribe();
      },
      error: (res) => {
        subs.unsubscribe();
      },
    });
  }

  getUsers() {
    const subs = this.orderService.getUsers({ active: true }).subscribe({
      next: (res) => {
        this.selectUserList = res;
        subs.unsubscribe();
      },
      error: (res) => {
        subs.unsubscribe();
      },
    });
  }
  printActionsList(id) {
    const subs = this.orderService.printActions(id).subscribe({
      next: (res) => {
        FileSaver.saveAs(res['data']);
        subs.unsubscribe();
      },
      error: (res) => {
        subs.unsubscribe();
      },
    });
  }
  sendActionsList(id) {
    const subs = this.orderService.sendActionsList(id).subscribe({
      next: (res) => {
        this.toaster.success(
          `Action List Sent Successfully`,
          'Success'
        );
        subs.unsubscribe();
      },
      error: (res) => {
        subs.unsubscribe();
      },
    });
  }
  // viewAttachment(id) {
  //   const subs = this.orderService.viewAttachment(id).subscribe({
  //     next: (res) => {
  //       this.selectedTemplates = res['data'];
  //       this.selectedTemplates.forEach((e) => {
  //         FileSaver.saveAs(e.blobReference);
  //       })
  //       subs.unsubscribe();
  //     },
  //     error: (res) => {
  //       subs.unsubscribe();
  //     },
  //   });
  // }
  viewTemplate(blob) {
    FileSaver.saveAs(blob);
  }
  comment_popup(id) {
    const DialogRef = this.dialog.open(NotesCommentsComponent, {
      data: { id: id, commentType: 'ActionList', quoteNo: this.quoteNo, orderNo: this.orderNo },
      width: '80%',
      height: '90%',
      disableClose: true
    });
  }
  viewPopUp(id) {
    const DialogRef = this.dialog.open(ViewComponent, {
      data: { id: id },
      width: '80%',
      height: '90%',
      disableClose: true
    });
  }
  deleteAction(id: number) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.orderService.deleteActions(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.toaster.success('Action Deleted Successfully', 'Deleted');
          isub.unsubscribe();
          this.getActions(this.quoteId);
        },
        error: (res) => {
          isub.unsubscribe();
        },
      });
  }
  uploadTemplate(event) {
    const file = event.target.files[0];
    this.templates.push(file);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  switchEditMode(i) {
    this.isEditing = true;
    this.enableEditIndex = i;
  }
  editModeOff() {
    this.isEditing = false;
    this.enableEditIndex = null;
  }

  save(actiontype) {
    this.isEditing = false;
    this.enableEditIndex = null;
    const data = Object.assign({}, this.tableForm.value);
    data.actionType = actiontype;
    data.orderNo = this.orderNo;
    data.actionDate = moment().format("YYYY-MM-DD HH:mm");
    console.log(data);
    const subs = this.orderService.createWithFiles(data, this.templates).subscribe({
      next: (res) => {
        this.toaster.success(
          `Action Performed Successfully`, 'Success');
        this.tableForm.get('actionName')?.reset();
        this.tableForm.get('notes')?.reset();
        this.tableForm.get('extraFieldDescription')?.reset();
        this.templates = [];
        this.getActions(this.quoteId);
        subs.unsubscribe();
      },
      error: (res) => {
        subs.unsubscribe();
      },
    });
  }

  cancel() {
    this.isEditing = false;
    this.enableEditIndex = null;
  }

  getUserNameAfterSave(actionArray) {
    actionArray.forEach((el, i) => {
      if (el.actionName !== null) {
        const name = this.selectUserList.find(e => e.value == el.actionName);
        this.selectedValue.push(name);
      }
    });

  }

  findIndex(a){
    return this.selectedValue.findIndex(x => x?.value == a) 
  }
}
