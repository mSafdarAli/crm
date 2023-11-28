import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap } from 'rxjs/operators';
import { MessageService } from 'src/_services/message.service';
import { PositionService } from 'src/_services/rest/positions.service';
import { SortService } from 'src/_services/sort.service';
import { PositionPopupComponent } from './position-popup/position-popup.component';

@Component({
  selector: 'app-print-positions',
  templateUrl: './print-positions.component.html',
  styleUrls: ['./print-positions.component.scss']
})
export class PrintPositionsComponent implements OnInit {
  data: any[] = [];
  count: number = 0;
  start: number = 1;
  end: number = 50;
  search: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private positionService: PositionService,
    private messageService: MessageService,
    private toaster: ToastrService,
    private sortService: SortService) {
    this.search = this.formBuilder.group({
      search: ['']
    })
  }
  ngOnInit(): void {
    this.getPositions({ startCount: this.start, endCount: this.end });
  }

  searchActionTypes(params) {
    this.data = [];
    this.start = 1;
    this.end = 50;
    this.getPositions({ startCount: this.start, endCount: this.end, ...params });
  }

  newDialog(id = null) {
    const DialogRef = this.dialog.open(PositionPopupComponent, {
      data: { id: id },
      width: '80%',
      minHeight: '70%',
      disableClose: true
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getPositions({ startCount: this.start, endCount: this.end });
      sub.unsubscribe();
    });
  }

  getPositions(params = null) {
    const sub = this.positionService.getPositions(params).subscribe({
      next: (res) => {
        this.data = res['data'];
        this.count = res['count']
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  deletePosition(id: number) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.positionService.deletePosition(id);
        })
      ).subscribe({
        next: (res) => {
          this.getPositions({ startCount: this.start, endCount: this.end });
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
      "group",
      "description",
    ], this.data);
  }

  getPrevious() {
    this.start = this.start - 50;
    this.end = this.end - 50;
    this.getPositions({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }

  getNext() {
    this.start = this.end + 1;
    this.end = this.end + 50;
    this.getPositions({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }

}
