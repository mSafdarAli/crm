import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { ComplaintService } from 'src/_services/rest/complaint.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PermissionService } from 'src/_services/permission.service';
import { NewComponent } from './new/new.component';
import { SortService } from 'src/_services/sort.service';
import { Sort } from '@angular/material/sort';
import { ExcelService } from 'src/_services/excel.service';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-current-complaints',
  templateUrl: './current-complaints.component.html',
  styleUrls: ['./current-complaints.component.scss']
})
export class CurrentComplaintsComponent implements OnInit {
  data: any[] = [];
  count: number = 0;
  start: number = 1;
  end: number = 50;
  moment = moment;
  fileName = 'Current Complaints.xlsx';
  search: FormGroup;
  constructor(
    private formBuilder: FormBuilder, 
    private complaintService: ComplaintService,
    private dialog: MatDialog,
    private sortService: SortService,
    public ps: PermissionService,
    private excelService: ExcelService,
    private toaster: ToastrService) {
    this.search = this.formBuilder.group({
      search: ['']
    })
   }

  ngOnInit(): void {
    this.getCurrentComplaints({ startCount: this.start, endCount: this.end })
  }


  openNewComplaint(value, status=null , orderNo){
    const DialogRef = this.dialog.open(NewComponent, {
      data: { quoteId: value, status: status  , orderNo:orderNo},
      width: '80%',
      height: '70%',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe(res => {
      this.getCurrentComplaints({ startCount: this.start, endCount: this.end });
      sub.unsubscribe();
    })
  }

  searchComplaints(params) {
    this.data = [];
    this.start - 1;
    this.end = 50;
    this.getCurrentComplaints({ startCount: this.start, endCount: this.end, ...params });
  }

  getCurrentComplaints(params=null) {
    const sub = this.complaintService.getCurrentComplaints(params).subscribe({
      next: res => {
        this.data = res['data'];
        this.count = res ['count'];
        sub.unsubscribe();
      }, error: res => {
        sub.unsubscribe();
      }
    });
  }

  exportexcel(): void {
    const sub = this.excelService.exportCurrentComplaints().subscribe({
      next: (res) => {
        FileSaver.saveAs(res['data']);
        this.toaster.success('Complaints Exported Successfully', 'Success');
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
        'status'],
      this.data
    );
  }

  getPrevious() {
    this.start = this.start - 50;
    this.end = this.end - 50;   
    this.getCurrentComplaints({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }

  getNext() {
    this.start = this.end + 1;
    this.end = this.end + 50;   
    this.getCurrentComplaints({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }
}
