import { Component, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import { ExcelService } from 'src/_services/excel.service';
import { PermissionService } from 'src/_services/permission.service';
import { QuoteService } from 'src/_services/rest/quote.service';
import { QuotesPopupComponent } from './quotes-popup/quotes-popup.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SortService } from 'src/_services/sort.service';
import { Sort } from '@angular/material/sort';
import { MessageService } from 'src/_services/message.service';
import { filter, switchMap } from 'rxjs';
import { NotesCommentsComponent } from 'src/app/shared/form-controller/notes-comments/notes-comments.component';
import { NewComponent } from 'src/app/workflow/complaints/current-complaints/new/new.component';

@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrls: ['./current.component.scss'],
})
export class CurrentComponent implements OnInit {
  data: any[] = [];
  search: FormGroup;
  moment = moment;
  fileName = 'Current Quotes.xlsx';
  count: number = 0;
  start: number = 1;
  end: number = 50;
  constructor(
    @Optional() private dialogRef: MatDialogRef<QuotesPopupComponent>,
    private dialog: MatDialog,
    private quoteService: QuoteService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toaster: ToastrService,
    private excelService: ExcelService,
    public ps: PermissionService,
    private sortService: SortService,
    private messageService: MessageService) {
    this.search = this.formBuilder.group({
      search: [''],
    });
  }

  ngOnInit(): void {
    this.getCurrentQuotes({ startCount: this.start, endCount: this.end });
  }

  newDialog(quoteNo) {
    const DialogRef = this.dialog.open(QuotesPopupComponent, {
      data: { quoteNo: quoteNo },
      minWidth: '40%',
      minHeight: '30%',
      disableClose: true
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getCurrentQuotes({ startCount: this.start, endCount: this.end });
      sub.unsubscribe();
    });
  }
  newComment(id,quoteNo) {
    const DialogRef = this.dialog.open(NotesCommentsComponent, {
      data: { id: id, commentType: 'Quote' ,quoteNo:quoteNo},
      minWidth: '80%',
      height: '70%',
      disableClose: true
    });
  }
  searchQuotes(params) {
    this.data = [];
    this.start = 1;
    this.end = 50;
    this.getCurrentQuotes({ startCount: this.start, endCount: this.end, ...params });
  }

  getPrevious() {
    this.start = this.start - 50;
    this.end = this.end - 50;
    this.getCurrentQuotes({ query: this.search.value.search, startCount: this.start, endCount: this.end });
  }

  getNext() {
    this.start = this.end + 1;
    this.end = this.end + 50;
    this.getCurrentQuotes({ query: this.search.value.search, startCount: this.start, endCount: this.end });
  }
  changeStatus(status: string, id) {
    const sub = this.quoteService.changeStatus(status, id).subscribe({
      next: res => {
        this.toaster.success('Status Updated', 'Status');
        this.getCurrentQuotes({ startCount: this.start, endCount: this.end });
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getCurrentQuotes(params) {
    const sub = this.quoteService.getCurrentQuotes(params).subscribe({
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
  viewQuote(id) {
    this.router.navigate(['/quotes/new-quotes'], { queryParams: { quoteId: id, title: "View Quote" } });
  }
  repeatQuote(values) {
    this.router.navigate(['/quotes/new-quotes'], { queryParams: { quoteId: values, repeatQuote: true, title: "Repeat Quote" } });
  }
  rejectQuote(id) {
    const isub = this.messageService
      .prompt(`Are you sure you want to reject this quote?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.quoteService.rejectQuote(id)
        })
      ).subscribe({
        next: (res) => {
          this.toaster.success('Quote Rejected Successfully', 'Rejected');
          this.getCurrentQuotes({ startCount: this.start, endCount: this.end });
          isub.unsubscribe();
        },
        error: (res) => {
          isub.unsubscribe();
        },
      });
  }
  sendQuote(quoteId, mailFrom) {
    const sub = this.quoteService.sendQuote({ quoteId: quoteId, mailFrom: mailFrom }).subscribe({
      next: (res) => {
        this.toaster.success('Mail Sent Successfully', 'Sent');
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  sendFollowUp(quoteId, mailFrom) {
    const sub = this.quoteService.sendFollowUp({ quoteId: quoteId, mailFrom: mailFrom }).subscribe({
      next: (res) => {
        this.toaster.success('Mail Sent Successfully', 'Sent');
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  actionList(id) {
    const sub = this.quoteService.actionList(id).subscribe({
      next: (res) => {
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  exportCurrentQuotes(): void {
    const sub = this.excelService.exportCurrentQuotes().subscribe({
      next: (res) => {
        FileSaver.saveAs(res['data']);
        this.toaster.success('Quote Exported Successfully', 'Success');
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  complaints(id, orderNo, quoteNo) {
    const DialogRef = this.dialog.open(NewComponent, {
      data: { quoteId: id, from: 'Quotes', orderNo: orderNo, quoteNo: quoteNo },
      minWidth: '80%',
      height: '70%',
      disableClose: true
    });
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
}











