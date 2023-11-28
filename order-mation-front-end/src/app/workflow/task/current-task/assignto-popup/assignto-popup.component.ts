import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { lookupdata } from 'src/_models/lookup';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { TaskService } from 'src/_services/rest/tasks.service';

@Component({
  selector: 'app-assignto-popup',
  templateUrl: './assignto-popup.component.html',
  styleUrls: ['./assignto-popup.component.scss'],
})
export class AssigntoPopupComponent implements OnInit {
  form: FormGroup;
  taskId: string = null;
  selectassignedto: lookupdata[] = [];
  constructor(
    @Optional() private dialogRef: MatDialogRef<AssigntoPopupComponent>,
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    @Inject(MAT_DIALOG_DATA) private data,
    private lookupService: LookUpService,
    private toaster: ToastrService
  ) {
    this.taskId = this.data.id;
    
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      assignedToId: [null,[Validators.required]],
    });

    if (this.taskId) {
      const sub = this.taskService.getSingleTask(this.taskId).subscribe({
        next: (res) => {
          this.form.patchValue({
            assignedToId: res['data'].assignedToId ? res['data'].assignedToId: '',
          });
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
    this.getAssignTo();
  }
  close() {
    console.log('close')
    this.dialogRef.close();
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

  submit() {
    if (this.form.valid) {
      const sub = this.taskService.assignTask(this.taskId, this.form.value.assignedToId).subscribe({
        next: (res) => {
          this.toaster.success(
            `Task Assigned Successfully`,
            'Success'
          );
          this.dialogRef.close();
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
