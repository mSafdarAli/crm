import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from 'src/_services/excel.service';
import { PermissionService } from 'src/_services/permission.service';
import { QuoteService } from 'src/_services/rest/quote.service';
import { SortService } from 'src/_services/sort.service';
import { QuotesPopupComponent } from '../current/quotes-popup/quotes-popup.component';
import * as FileSaver from 'file-saver';
import { NotesCommentsComponent } from 'src/app/shared/form-controller/notes-comments/notes-comments.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  data: any[] = [];
  moment = moment;
  count: number = 0;
  start: number = 1;
  end: number = 50;
  search: FormGroup;
  constructor(@Optional() private dialogRef: MatDialogRef<QuotesPopupComponent>, private dialog: MatDialog,
    private quoteService: QuoteService,
    public ps: PermissionService,
    private sortService: SortService,
    private router: Router,
    private toaster: ToastrService,
    private formBuilder: FormBuilder,
    private excelService: ExcelService) {
    this.search = this.formBuilder.group({
      search: ['']
    })
  }
  ngOnInit(): void {
    this.getQuotesHistory({ startCount: this.start, endCount: this.end });
  }

  searchHistory(params) {
    this.data = [];
    this.start = 1;
    this.end = 50;
    this.getQuotesHistory({ startCount: this.start, endCount: this.end, ...params });
  }

  getPrevious() {
    this.start = this.start - 50;
    this.end = this.end - 50;
    this.getQuotesHistory({ query: this.search.value.search, startCount: this.start, endCount: this.end });
  }

  getNext() {
    this.start = this.end + 1;
    this.end = this.end + 50;
    this.getQuotesHistory({ query: this.search.value.search, startCount: this.start, endCount: this.end });
  }
  newDialog() {
    const DialogRef = this.dialog.open(QuotesPopupComponent, {
      // data: { filter_val: this.form.value.filter_val, filter_year: this.form.value.filter_year, dateData: item },
      width: '70%',
      height: '90%',
      disableClose: true
    });
  }
  newComment(id,quoteNo) {
    const DialogRef = this.dialog.open(NotesCommentsComponent, {
      data: { id:id , commentType: 'Quote',quoteNo:quoteNo},
      width: '80%',
      height: '70%',
      disableClose: true
    });
  }
  viewQuote(id) {
    this.router.navigate(['/quotes/new-quotes'], { queryParams: { quoteId: id, title:"View Quote" } });
  }
  repeatQuote(values) {
    this.router.navigate(['/quotes/new-quotes'], { queryParams: { quoteId: values, repeatQuote: true, title:"Repeat Quote"} });
  }
  getQuotesHistory(params) {
    const sub = this.quoteService.getQuotesHistory(params).subscribe({
      next: res => {
        this.data = res['data']; 
        this.count = res['count'];
        sub.unsubscribe();
      }, error: res => {
        sub.unsubscribe();
      }
    });
  }
  changeStatus(status: string, id) {
    const sub = this.quoteService.changeStatus(status, id).subscribe({
      next: res => {
        this.toaster.success('Status Updated', 'Status');
        this.getQuotesHistory({ startCount: this.start, endCount: this.end });
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  reOpenQuote(id) {
    const sub = this.quoteService.reOpenQuote(id).subscribe({
      next: res => {
        this.toaster.success('Quote Re-Opened Successfully', 'Status');
        this.getQuotesHistory({ startCount: this.start, endCount: this.end });
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
    // this.router.navigate(['/quotes/new-quotes'], { queryParams: { quoteId: values, reOpenQuote: true, title: "Re-Open Quote" } });

  }
  sortData(sort: Sort) {
    this.data = this.sortService.getSortedData(
      sort,
      ["quoteNo",
        "quoteDate",
        "customer",
        "jobName",
        "repName",
        "followUp",
        "followUpSent",
        "quoteSent",
        "contactName",
        "contactEmail"],
      this.data
    );
  }

  exportQuoteHistory(): void {
    const sub = this.excelService.exportQuoteHistory().subscribe({
      next: (res) => {
        FileSaver.saveAs(res['data']);
        this.toaster.success('Quote History Exported Successfully', 'Success');
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
}