import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lookupdata } from 'src/_models/lookup';
import { MessageService } from 'src/_services/message.service';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { TaskService } from 'src/_services/rest/tasks.service';
import { changeDateToApiFormat } from 'src/_services/utility';

@Component({
  selector: 'app-newtask-popup',
  templateUrl: './newtask-popup.component.html',
  styleUrls: ['./newtask-popup.component.scss']
})
export class NewtaskPopupComponent implements OnInit {
  ViewTaskID: string = null;
  form: FormGroup;
  title: string = "New";
  repeatButton : boolean=false;
  selectassignedto: lookupdata[] = [];
  selecttasktype: lookupdata[] = [];
  constructor(
    @Optional() private dialogRef: MatDialogRef<NewtaskPopupComponent>,
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data,
    private lookupService: LookUpService,
    private router : Router,
    private toaster: ToastrService
  ) {
    this.form = this.formBuilder.group({
      taskTypeId: [null, [Validators.required]],
      assignedToId: [null],
      description: [null],
      name: [null, [Validators.required]],
      dueDate: [null],
    });

    this.ViewTaskID = this.data.id;
    this.title = data.title;
   this.repeatButton =this.data.repeatButton;
  }

  ngOnInit(): void {
    this.getHistory();
    this.getAssignTo();

    if (this.ViewTaskID && this.data.view) {
      const sub = this.taskService.getSingleTask(this.ViewTaskID).subscribe({
        next: (res) => {
          this.patchForm(res['data']);
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
    if(this.ViewTaskID && this.data.repeat){
      const sub = this.taskService.repeatTask(this.ViewTaskID).subscribe({
        next: (res) => {
          this.patchForm(res['data']);
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
  }
patchForm(data){
  this.form.patchValue({
    taskTypeId: data.taskTypeId ? data.taskTypeId : '',
    assignedToId: data.assignedToId ? data.assignedToId : '',
    description: data.description ? data.description : '',
    name: data.name ? data.name : '',
    dueDate: data.dueDate ? data.dueDate : '',
  });
}
  getHistory() {
    const sub = this.lookupService.getHistory().subscribe({
      next: (res) => {
        this.selecttasktype = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getAssignTo() {
    const sub = this.lookupService.getAssignTo().subscribe({
      next: (res) => {
        this.selectassignedto = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit(){ 
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value);
      data.dueDate=changeDateToApiFormat(this.form.value.dueDate);
      if (this.ViewTaskID) {
        data.id = this.ViewTaskID;
      }

      if (this.repeatButton){
        delete data.id;
      }
      delete data.taskType;
      const sub = this.taskService.createOrUpdatetasks(data).subscribe({
        next: (res) => {
          this.toaster.success(
            `Task ${(this.ViewTaskID && this.repeatButton) ? 'Repeated' : (this.ViewTaskID)? 'Updated' : 'Created'} Successfully`,
            'Success'
          );
          this.dialogRef.close();
          this.router.navigate(['/workflow/current-task']);
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
