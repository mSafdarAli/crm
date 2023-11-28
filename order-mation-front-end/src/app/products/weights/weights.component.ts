import { Component, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap } from 'rxjs';
import { MessageService } from 'src/_services/message.service';
import { WeightsService } from 'src/_services/rest/weights.service';
import { SortService } from 'src/_services/sort.service';
import { WeightPopupComponent } from './weight-popup/weight-popup.component';

@Component({
  selector: 'app-weights',
  templateUrl: './weights.component.html',
  styleUrls: ['./weights.component.scss'],
})
export class WeightsComponent implements OnInit {
  data: [] = [];
  count: number = 0;
  start: number = 1;
  end: number = 50;
  search: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<WeightPopupComponent>,
    private dialog: MatDialog,
    private weightsService: WeightsService,
    private messageService: MessageService,
    private toaster: ToastrService,
    private sortService: SortService
  ) {
    this.search = this.formBuilder.group({
      search: [''],
    });
  }
  ngOnInit(): void {
    this.getWeights({ startCount: this.start, endCount: this.end });
  }
  searchActionTypes(params) {
    this.data = [];
    this.start = 1;
    this.end = 50;
    this.getWeights({ startCount: this.start, endCount: this.end, ...params });
  }
  newDialog(id = null) {
    const DialogRef = this.dialog.open(WeightPopupComponent, {
      data: { id: id },
      width: '75%',
      minHeight: '70%',
      disableClose: true,
    });

    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getWeights({ startCount: this.start, endCount: this.end });
      sub.unsubscribe();
    });
  }

  getWeights(params) {
    const sub = this.weightsService.getWeights(params).subscribe({
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

  deleteWeights(id: number) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.weightsService.delete(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getWeights({ startCount: this.start, endCount: this.end });
          this.toaster.success('Deleted Successfully', 'Deleted');
          isub.unsubscribe();
        },
        error: (res) => {
          isub.unsubscribe();
        },
      });
  }

  sortData(sort: Sort) {
    this.data = this.sortService.getSortedData(
      sort,
      ['code', 'description'],
      this.data
    );
  }

  getPrevious() {
    this.start = this.start - 50;
    this.end = this.end - 50;   
    this.getWeights({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }

  getNext() {
    this.start = this.end + 1;
    this.end = this.end + 50;   
    this.getWeights({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }
}
