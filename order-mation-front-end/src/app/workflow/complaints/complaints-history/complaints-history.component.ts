import { Component, OnInit } from '@angular/core';
import { ComplaintService } from 'src/_services/rest/complaint.service';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PermissionService } from 'src/_services/permission.service';
import { NewComponent } from '../current-complaints/new/new.component';
import { MatDialog } from '@angular/material/dialog';
import { SortService } from 'src/_services/sort.service';
import { Sort } from '@angular/material/sort';
import { ExcelService } from 'src/_services/excel.service';
import { ToastrService } from 'ngx-toastr';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-complaints-history',
  templateUrl: './complaints-history.component.html',
  styleUrls: ['./complaints-history.component.scss'],
})
export class ComplaintsHistoryComponent implements OnInit {
  data: any[] = [];
  count: number = 0;
  start: number = 1;
  end: number = 50;
  fileName = 'Complaints History.xlsx';
  search: FormGroup;
  moment = moment;
  constructor(
    private complaintService: ComplaintService,
    private sortService: SortService,
    private formBuilder: FormBuilder,
    public ps: PermissionService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private toaster: ToastrService
  ) {
    this.search = this.formBuilder.group({
      search: [''],
    });
  }

  ngOnInit(): void {
    this.getComplaintsHistory({ startCount: this.start, endCount: this.end });
  }

  searchComplaintsHistory(params) {
    this.data = [];
    this.start = 1;
    this.end = 50;
    this.getComplaintsHistory({
      startCount: this.start,
      endCount: this.end,
      ...params,
    });
  }

  getComplaintsHistory(params = null) {
    const sub = this.complaintService.getComplaintHistory(params).subscribe({
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

  openNewComplaint(value, status = null) {
    const DialogRef = this.dialog.open(NewComponent, {
      data: { quoteId: value, status: status },
      width: '80%',
      height: '70%',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getComplaintsHistory({ startCount: this.start, endCount: this.end });
      sub.unsubscribe();
    });
  }

  exportexcel(): void {
    const sub = this.excelService.exportComplaintHistory().subscribe({
      next: (res) => {
        FileSaver.saveAs(res['data']);
        this.toaster.success('Complaint History Exported Successfully', 'Success');
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
        'quoteNo',
        'quoteDate',
        'orderNo',
        'orderDate',
        'customer',
        'jobName',
        'repName',
        'complaintDate',
        'reason',
        'status'
      ],
      this.data
    );
  }

  getPrevious() {
    this.start = this.start - 50;
    this.end = this.end - 50;
    this.getComplaintsHistory({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }

  getNext() {
    this.start = this.end + 1;
    this.end = this.end + 50;
    this.getComplaintsHistory({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }
}
