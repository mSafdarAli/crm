import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PermissionService } from 'src/_services/permission.service';
import { AssigntoPopupComponent } from './assignto-popup/assignto-popup.component';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { TaskService } from 'src/_services/rest/tasks.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SortService } from 'src/_services/sort.service';
import { Sort } from '@angular/material/sort';
import { NewtaskPopupComponent } from '../newtask-popup/newtask-popup.component';
import { ToastrService } from 'ngx-toastr';
import { NotesCommentsComponent } from 'src/app/shared/form-controller/notes-comments/notes-comments.component';
import { ExcelService } from 'src/_services/excel.service';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-current-task',
  templateUrl: './current-task.component.html',
  styleUrls: ['./current-task.component.scss'],
})
export class CurrentTaskComponent implements OnInit {
  data: [] = [];
  count: number = 0;
  start: number = 1;
  end: number = 50;
  fileName = 'Current Task.xlsx';
  AssignToID: string = null;
  RepeatTaskID: string = null;
  search: FormGroup;
  StatusID: string = null;
  moment = moment;
  constructor(private dialog: MatDialog,
    private taskService: TaskService,
    public ps: PermissionService,
    private formBuilder: FormBuilder,
    private toaster: ToastrService,
    private sortService: SortService,
    private excelService: ExcelService) { }

  ngOnInit(): void {
    this.search = this.formBuilder.group({
      search: [''],
    });
    this.getCurrentTasks({ startCount: this.start, endCount: this.end });
  }

  newDialog(id=null) {
    const DialogRef = this.dialog.open(NewtaskPopupComponent, {
      data:{id:id, title: "New"},
      width: '70%',
      height: '70%',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe(result => {
      this.getCurrentTasks({ startCount: this.start, endCount: this.end });
      sub.unsubscribe();
    });
  }
  comment_popUp(id) {
    const DialogRef = this.dialog.open(NotesCommentsComponent, {
      data: { id: id, commentType: 'Task' , taskNo:id },
      width: '80%',
      height: '70%',
      disableClose: true
    });
  }
  viewTask(id) {
    const DialogRef = this.dialog.open(NewtaskPopupComponent, {
      data: { id: id , view : true, title:"View"},
      width: '70%',
      height: '70%',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getCurrentTasks({ startCount: this.start, endCount: this.end });
      sub.unsubscribe();
    });
  }

  assignTask(id, taskTypeId, name, description) {
    const DialogRef = this.dialog.open(AssigntoPopupComponent, {
      data: { id: id, taskTypeId: taskTypeId, name: name, description: description },
      width: '60%',
      height: '40%',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getCurrentTasks({ startCount: this.start, endCount: this.end });
      sub.unsubscribe();
    });
  }

  repeatTask(id) {
    const DialogRef = this.dialog.open(NewtaskPopupComponent, {
      data: { id: id , repeat : true, title:"Repeat",repeatButton : true},
      minWidth: '70%',
      height: '70%',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getCurrentTasks({ startCount: this.start, endCount: this.end });
      sub.unsubscribe();
    });
  }


  

  searchActionTypes(params) {
    this.data = [];
    this.start = 1;
    this.end = 50;
    this.getCurrentTasks({ startCount: this.start, endCount: this.end, ...params });
  }
  getCurrentTasks(params ) {
    const sub = this.taskService.getCurrentTasks(params).subscribe({
      next: (res) => {
        this.data = res['data'];
        this.count = res['count'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  changeStatus(value, id) {
    const sub = this.taskService.changeStatus(value, id).subscribe({
      next: (res) => {
        this.toaster.success(
          `Status Changed Successfully`,
          'Success'
        );
        this.getCurrentTasks({ startCount: this.start, endCount: this.end });
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  exportexcel(): void {
    const sub = this.excelService.exportCurrentTasks().subscribe({
      next: (res) => {
        FileSaver.saveAs(res['data']);
        this.toaster.success('Tasks Exported Successfully', 'Success');
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
        'startedBy'
      ],
      this.data
    );
  }
  getPrevious() {
    this.start = this.start - 50;
    this.end = this.end - 50;   
    this.getCurrentTasks({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }

  getNext() {
    this.start = this.end + 1;
    this.end = this.end + 50;   
    this.getCurrentTasks({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }
}
