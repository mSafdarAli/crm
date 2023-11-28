import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { lookupdata } from 'src/_models/lookup';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { SalesTargetService } from 'src/_services/rest/salesTarget.service';
@Component({
  selector: 'app-new-target',
  templateUrl: './new-target.component.html',
  styleUrls: ['./new-target.component.scss'],
})
export class NewTargetComponent implements OnInit {
  form: FormGroup;
  selectRep: lookupdata[] = [];
  selectone: lookupdata[] = [];
  selectyear: lookupdata[] = [];
  selectMonth: lookupdata[] = [];
  selectfour: lookupdata[] = [];
  saleTargetId: string = null;

  constructor(private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewTargetComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    private lookupService: LookUpService,
    private saleTargetService: SalesTargetService,
    private toaster: ToastrService) {
    this.saleTargetId = this.data.id;
    this.selectone.push(
      { name: 'Month', value: 'month' },
      { name: 'Week', value: 'week' }
    );
    this.selectyear = this.lookupService.getYears();
    this.selectMonth = this.lookupService.getMonths();
    this.selectfour.push(
      { name: 'January', value: '1' },
      { name: 'January', value: '2' },
      { name: 'January', value: '3' }
    );
    this.getByRole();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      repId: [null, Validators.required],
      monthweek: [null, Validators.required],
      year: [null, [Validators.required]],
      month: [null],
      week: [null],
      budget: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
    if (this.saleTargetId) {
      const sub = this.saleTargetService
        .getSaleTarget(this.saleTargetId)
        .subscribe({
          next: (res) => {
            this.form.patchValue({
              repId: res['data'].repId ? res['data'].repId : '',
              monthweek: res['data'].month ? 'month' : 'week',
              year: res['data'].year ? res['data'].year : '',
              month: res['data'].month ? res['data'].month.toString() : '',
              week: res['data'].week ? moment().year(res['data'].year).isoWeek(res['data'].week) : '',
              budget: res['data'].budget ? res['data'].budget.toString() : '',
            });
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
    }
  }

  close() {
    this.dialogRef.close();
  }

  getByRole() {
    const sub = this.lookupService.getByRole().subscribe({
      next: (res) => {
        this.selectRep = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value);
      if (this.saleTargetId) {
        data.id = this.saleTargetId;
      }
      if (this.form.value.monthweek == 'week') {
        data.week = moment(this.form.value.week).format('w')
      }
      const sub = this.saleTargetService
        .createOrUpdateSalesTarget(data)
        .subscribe({
          next: (res) => {
            this.toaster.success(
              `Sales Target ${this.saleTargetId ? 'Updated' : 'Created'
              } Successfully`,
              'Success'
            );
            this.dialogRef.close();
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
    } else {
      this.form.markAllAsTouched()
    }
  }

  setRequired() {
    const formData = this.form.value;
    if (formData.monthweek == 'month') {
      this.form.controls['week'].clearValidators();
      this.form.controls['month'].setValidators(Validators.required);
      this.form.controls['month'].updateValueAndValidity()
      this.form.controls['week'].updateValueAndValidity()
    } else {
      this.form.controls['month'].clearValidators();
      this.form.controls['week'].setValidators(Validators.required)
      this.form.controls['week'].updateValueAndValidity()
      this.form.controls['month'].updateValueAndValidity()
    }
  }
}
