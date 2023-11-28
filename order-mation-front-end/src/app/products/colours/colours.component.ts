import { Component, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Toast, ToastrService } from 'ngx-toastr';
import { filter, switchMap } from 'rxjs';
import { MessageService } from 'src/_services/message.service';
import { ColoursService } from 'src/_services/rest/colours.service';
import { SortService } from 'src/_services/sort.service';
import { ColourPopupComponent } from './colour-popup/colour-popup.component';

@Component({
  selector: 'app-colours',
  templateUrl: './colours.component.html',
  styleUrls: ['./colours.component.scss'],
})
export class ColoursComponent implements OnInit {
  data: [] = [];
  count: number = 0;
  start: number = 1;
  end: number = 50;
  search: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<ColourPopupComponent>,
    private dialog: MatDialog,
    private colourService: ColoursService,
    private messageService: MessageService,
    private toaster: ToastrService,
    private sortService: SortService
  ) {
    this.search = this.formBuilder.group({
      search: ['']
    })
  }
  ngOnInit(): void {
    this.getColours({ startCount: this.start, endCount: this.end });
  }
  searchActionTypes(params) {
    this.data = [];
    this.start = 1;
    this.end = 50;
    this.getColours({ startCount: this.start, endCount: this.end, ...params });
  }
  getPrevious() {
    this.start = this.start - 50;
    this.end = this.end - 50;
    this.getColours({ query: this.search.value.search, startCount: this.start, endCount: this.end });
  }

  getNext() {
    this.start = this.end + 1;
    this.end = this.end + 50;
    this.getColours({ query: this.search.value.search, startCount: this.start, endCount: this.end });
  }
  newDialog(id = null) {
    const DialogRef = this.dialog.open(ColourPopupComponent, {
      data: { id: id },
      width: '80%',
      minHeight: '70%',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getColours({ startCount: this.start, endCount: this.end });
      sub.unsubscribe();
    });
  }

  getColours(params) {
    const sub = this.colourService.getColours(params).subscribe({
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

  deleteColours(id: number) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.colourService.delete(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getColours({ startCount: this.start, endCount: this.end });
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
      "colourType",
      "code",
      "description",
    ], this.data);
  }
}
