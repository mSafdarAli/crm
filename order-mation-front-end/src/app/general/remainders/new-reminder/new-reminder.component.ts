import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { lookupdata } from 'src/_models/lookup';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { RemindersService } from 'src/_services/rest/reminders.service';

@Component({
  selector: 'app-new-reminder',
  templateUrl: './new-reminder.component.html',
  styleUrls: ['./new-reminder.component.scss']
})
export class NewReminderComponent implements OnInit {
  form: FormGroup;
  selectdays: lookupdata[] = [];
  selectmailtemplate: lookupdata[] = [];
  selectbeforeafter: lookupdata[] = [];
  selectstopaction: lookupdata[] = [];
  selectstartaction: lookupdata[] = [];
  selectdate: lookupdata[] = [];
  reminderID: string = null;
  constructor(private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewReminderComponent>,
    private lookupService: LookUpService,
    private reminderService: RemindersService,
    private toaster: ToastrService,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.reminderID = this.data.id;
    this.selectdays = this.lookupService.getdays();
    this.selectbeforeafter.push(
      { name: 'Before', value: 'Before' },
      { name: 'After', value: 'After' }
    );
    this.selectdate = this.reminderService.getDates();
  }


  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(100)]],
      subject: [null],
      days: [null, [Validators.required]],
      description: [null, [Validators.required, Validators.maxLength(500)]],
      beforeafter: [null, [Validators.required, Validators.maxLength(50)]],
      dateType: [null , [Validators.required, Validators.maxLength(50)]],
      startOnAction: [null],
      stopOnAction: [null],
      notificationTemplate: [null , [Validators.required]],
      sendToCustomer: [false],
      sendToRep: [false],
      attachQuote: [false],
      attachOrder: [false],
      active: [true],
    });

    if (this.reminderID) {
      const sub = this.reminderService
        .getSingleReminder(this.reminderID)
        .subscribe({
          next: (res) => {
            this.form.patchValue({
              name: res['data'].name ? res['data'].name : '',
              days: res['data'].days ? res['data'].days : '',
              description: res['data'].description ? res['data'].description : '',
              beforeafter: res['data'].beforeAfter ? res['data'].beforeAfter : '',
              dateType: res['data'].dateType ? res['data'].dateType : '',
              startOnAction: res['data'].startOnAction ? res['data'].startOnAction : '',
              stopOnAction: res['data'].stopOnAction ? res['data'].stopOnAction : '',
              notificationTemplate: res['data'].notificationTemplate ? res['data'].notificationTemplate : '',
              sendToCustomer: res['data'].sendToCustomer ? res['data'].sendToCustomer : false,
              sendToRep: res['data'].sendToRep ? res['data'].sendToRep : false,
              attachQuote: res['data'].attachQuote ? res['data'].attachQuote : false,
              attachOrder: res['data'].attachOrder ? res['data'].attachOrder : false,
              active: res['data'].active ? res['data'].active : false,
            });
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
    }
    this.getStartAction();
    this.getStopAction();
    this.getmailTemlate();
  }
  
  close() {
    this.dialogRef.close()
  }
  getStartAction() {
    const sub = this.lookupService.getActionTypes().subscribe({
      next: (res) => {
        this.selectstartaction = res
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getStopAction() {
    const sub = this.lookupService.getActionTypes().subscribe({
      next: (res) => {
        this.selectstopaction = res
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getmailTemlate() {
    const sub = this.lookupService.getNotifications().subscribe({
      next: (res) => {
        this.selectmailtemplate = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  submit() {
    
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value);
      if (this.reminderID) {
        data.id = this.reminderID;
      }
      const sub = this.reminderService
        .createOrUpdateReminder(data)
        .subscribe({
          next: (res) => {
            this.toaster.success(
              `Reminder ${this.reminderID ? 'Updated' : 'Created'
              } Successfully`,
              'Success'
            );
            this.dialogRef.close();
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
    }
    else {
      this.form.markAllAsTouched();
    }
  }
}
