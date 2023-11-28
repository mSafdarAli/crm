import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExcelService } from 'src/_services/excel.service';
import * as XLSX from 'xlsx';
import { TaskService } from 'src/_services/rest/tasks.service';
import { SortService } from 'src/_services/sort.service';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { NewtaskPopupComponent } from '../newtask-popup/newtask-popup.component';
import * as moment from 'moment';
import { NotesCommentsComponent } from 'src/app/shared/form-controller/notes-comments/notes-comments.component';
import { PermissionService } from 'src/_services/permission.service';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-task-history',
  templateUrl: './task-history.component.html',
  styleUrls: ['./task-history.component.scss'],
})
export class TaskHistoryComponent implements OnInit {
  data: [] = [];
  count: number = 0;
  start: number = 1;
  end: number = 50;
  fileName = 'Task History.xlsx';
  search: FormGroup;
  StatusID : string = null;
  moment = moment;

  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewtaskPopupComponent>,
    private dialog: MatDialog,
    private taskService: TaskService,
    private excelService: ExcelService,
    public ps: PermissionService,
    private sortService: SortService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.search = this.formBuilder.group({
      search: [''],
    });
    this.getTaskHistory({ startCount: this.start, endCount: this.end });
  }
  newDialog(id=null) {
    const DialogRef = this.dialog.open(NewtaskPopupComponent, {    
      data:{id:id}, 
      width: '70%',
      height: '70%',
      disableClose: true,
    });
  }

  getTaskHistory(params = null) {
    const sub = this.taskService.getTaskHistory(params).subscribe({
      next: (res) => {
        this.data = res['data'];
        this.count = res ['count'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  viewTask(id ) {
    const DialogRef = this.dialog.open(NewtaskPopupComponent, {
      data: { id: id  , view:true},
      width: '70%',
      height: '70%',
      disableClose: true,
    });
  }

  repeatTask(id) {
    const DialogRef = this.dialog.open(NewtaskPopupComponent, {
      data: { id: id ,repeat : true,repeatButton : true},
      width: '70%',
      height: '70%',
      disableClose: true,
    });
  }
  comment_popUp(id) {
    const DialogRef = this.dialog.open(NotesCommentsComponent, {
      data: { id:id , commentType: 'Task' , taskNo:id},
      width: '80%',
      height: '70%',
      disableClose: true
    });
  }


  searchActionTypes(params) {
    console.log(params);
    this.data = [];    
    this.start = 1;
    this.end = 50;
    this.getTaskHistory({ startCount: this.start, endCount: this.end, ...params });
  }

  exportexcel(): void {
    const sub = this.excelService.exportTaskHistory().subscribe({
      next: (res) => {
        FileSaver.saveAs(res['data']);
        this.toaster.success('Task History Exported Successfully', 'Success');
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  sortData(sort: Sort) {
    this.data = this.sortService.getSortedData(
      sort,
      [
        'id',
        'taskDate',
        'taskType',
        'name',
        'description',
        'dueDate',
        'createdBy',
        'taskStatus',
        'dateAssigned',
        'assignedTo',
        'dateStarted',
        'startedBy',
        'dateComplete',
        'completedBy'
      ],
      this.data
    );
  }

  getPrevious() {
    this.start = this.start - 50;
    this.end = this.end - 50;   
    this.getTaskHistory({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }

  getNext() {
    this.start = this.end + 1;
    this.end = this.end + 50;   
    this.getTaskHistory({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }
}
