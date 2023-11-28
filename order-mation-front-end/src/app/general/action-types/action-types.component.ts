import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap } from 'rxjs/operators';
import { lookupdata } from 'src/_models/lookup';
import { MessageService } from 'src/_services/message.service';
import { ActionTypeService } from 'src/_services/rest/actionType.service';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { SortService } from 'src/_services/sort.service';
import { NewActionTypeComponent } from './new-action-type/new-action-type.component';


@Component({
  selector: 'app-action-types',
  templateUrl: './action-types.component.html',
  styleUrls: ['./action-types.component.scss']
})
export class ActionTypesComponent implements OnInit {
  data: any[] = [];
  count: number = 0;
  start: number = 1;
  end: number = 50;
  search: FormGroup;
  selectType: lookupdata[] = [];
  constructor(private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private actionService: ActionTypeService,
    private toaster: ToastrService,
    private messageService: MessageService,
    private sortService: SortService,
    private lookupService: LookUpService) {
    const sub = this.lookupService.getTypes().subscribe({
      next: res => {
        this.selectType = res;
        sub.unsubscribe();
      },
      error: res => {
        sub.unsubscribe();
      }
    });
    this.search = this.formBuilder.group({
      search: [''],
      filter: ['Orders']
    })
  }

  ngOnInit(): void {
    this.getAllAction({ startCount: this.start, endCount: this.end, type: this.search.value.filter });
  }

  searchActionTypes(params) {
    this.data = [];
    this.start = 1;
    this.end = 50;
    this.getAllAction({ startCount: this.start, endCount: this.end, type: this.search.value.filter, ...params });
  }

  newDialog(id = null) {
    const DialogRef = this.dialog.open(NewActionTypeComponent, {
      data: { id: id },
      width: '80%',
      height: '70%',
      disableClose: true
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getAllAction({ startCount: this.start, endCount: this.end });
      sub.unsubscribe();
    });
  }

  getAllAction(params = null) {
    const sub = this.actionService.getAll(params).subscribe({
      next: (res) => {
        if ((typeof res['data'] != 'string')) {
          this.data = res['data'];
          this.count = res['count'];
        } else {
          this.data = [];
          this.count = 0;
          this.toaster.success(res['data'], 'Success');
        }
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  deleteActionType(id: number) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.actionService.deleteActionType(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllAction({ startCount: this.start, endCount: this.end });
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
      "description",
      "sortOrder",
      "category",
    ], this.data);
  }

  getPrevious() {
    this.start = this.start - 50;
    this.end = this.end - 50;
    this.getAllAction({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
      type: this.search.value.filter
    });
  }

  getNext() {
    this.start = this.end + 1;
    this.end = this.end + 50;
    this.getAllAction({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
      type: this.search.value.filter
    });
  }

  selectedType(type) {
    this.start = 1;
    this.end = 50;
    this.getAllAction({
      query: this.search.value.search,
      startCount: this.start,
      endCount: this.end,
      type: type
    });
  }

}
