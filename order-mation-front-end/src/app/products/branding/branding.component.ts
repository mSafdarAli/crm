import { Component, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { MessageService } from 'src/_services/message.service';
import { BrandingService } from 'src/_services/rest/branding.service';
import { SortService } from 'src/_services/sort.service';
import { BrandingPopupComponent } from './branding-popup/branding-popup.component';

@Component({
  selector: 'app-branding',
  templateUrl: './branding.component.html',
  styleUrls: ['./branding.component.scss'],
})
export class BrandingComponent implements OnInit {
  data: [] = [];
  count : number = 0;
  start: number = 1;
  end: number = 50;
  search: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<BrandingPopupComponent>,
    private dialog: MatDialog,
    private brandingService: BrandingService,
    private messageService: MessageService,
    private toaster: ToastrService,
    private sortService: SortService
  ) {

    this.search = this.formBuilder.group({
      search: ['']
    })
  }
  ngOnInit(): void {
    this.getBrandings({startCount :this.start , endCount : this.end});
  }
  searchActionTypes(params) {
    this.data = [];
    this.start = 1;
    this.end = 50;
    this.getBrandings({ startCount: this.start, endCount: this.end, ...params});
  }
  newDialog(id = null) {
    const DialogRef = this.dialog.open(BrandingPopupComponent, {
      data: { id: id },
      width: '80%',
      minHeight: '70%',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getBrandings({startCount :this.start , endCount : this.end});
      sub.unsubscribe();
    });
  }


  getBrandings(params) {
    const sub = this.brandingService.getBrandings(params).subscribe({
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

  deleteBranding(id: number) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.brandingService.delete(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getBrandings({startCount :this.start , endCount : this.end});
          this.toaster.success('Deleted Successfully', 'Deleted');
          isub.unsubscribe();
        },
        error: (res) => {
          isub.unsubscribe();
        },
      });
  }

  sortData(sort: Sort) {
    this.data = this.sortService.getSortedData(sort, [
      "code",
      "name",
      "description", 
      "action",         
      ], this.data);
  }

  getPrevious() {
    this.start = this.start-50;
    this.end = this.end - 50;
    this.getBrandings({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }

  getNext() {
    this.start = this.end+1;
    this.end = this.end + 50;
    this.getBrandings({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }
}
