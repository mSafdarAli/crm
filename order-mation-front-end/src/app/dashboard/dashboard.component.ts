import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { barGraph, dashboardData, lineGraph, User } from 'src/_models';
import { lookupdata } from 'src/_models/lookup';
import { AuthService } from 'src/_services/auth.service';
import { PermissionService } from 'src/_services/permission.service';
import { DashboardService } from 'src/_services/rest/dashboard.service';
import { UserService } from 'src/_services/rest/user.service';
import { changeDateToApiFormat } from 'src/_services/utility';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  form: FormGroup;
  userInfo: User;
  selectRep: lookupdata[] = [];
  data: dashboardData;
  barGraph: barGraph;
  lineGraph: lineGraph;
  
  constructor(private formBuilder: FormBuilder,
    private _dashboardService: DashboardService,
    private _userService: UserService,
    private _authService: AuthService,
    private ps: PermissionService) {
    const sub = this.ps.getPermissions(parseInt(this._authService.userDetails.nameid)).subscribe({
      next: res => {
        sub.unsubscribe();
      }, error: res => {
        sub.unsubscribe();
      }
    });
    this.form = this.formBuilder.group({
      startDate: [null],
      endDate: [null],
      reps: [this._authService.userDetails.nameid]
    });
    this.getRep(this._authService.userDetails.nameid);
    this.getDefaultData();
    this.getSalesVsRep();
    this.getsalesVsTarget();
  }

  ngOnInit(): void { }

  getDefaultData() {
    const sub = this._dashboardService.salesTotal(this.form.value).subscribe({
      next: res => {
        this.data = res['data'];
        sub.unsubscribe();
      }, error: res => {
        sub.unsubscribe();
      }
    });
  }

  getRep(userId: string) {
    const sub = this._userService.getRep(userId).subscribe({
      next: res => {
        this.selectRep = res;
        sub.unsubscribe();
      }, error: res => {
        sub.unsubscribe();
      }
    });
  }

  getSalesVsRep() {
    const sub = this._dashboardService.salesPerRep(this.form.value).subscribe({
      next: res => {
        this.barGraph = res['data'];
        sub.unsubscribe();
      }, error: res => {
        sub.unsubscribe();
      }
    });
  }

  getsalesVsTarget() {
    const sub = this._dashboardService.salesVsTarget(this.form.value).subscribe({
      next: res => {
        this.lineGraph = res['data'];
        sub.unsubscribe();
      }, error: res => {
        sub.unsubscribe();
      }
    });
  }

  submit(): void {
    this.barGraph = null;
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value);
      data.reps = (this.form.value.reps) ? this.form.value.reps.map(x => x).join(",") : "";
      data.startDate = changeDateToApiFormat(this.form.value.startDate);
      data.endDate = changeDateToApiFormat(this.form.value.endDate);
      const sub = this._dashboardService.salesTotal(data).subscribe({
        next: res => {
          this.data = res['data'];
          sub.unsubscribe();
        }, error: res => {
          sub.unsubscribe();
        }
      });
      const subSalesPerRep = this._dashboardService.salesPerRep(data).subscribe({
        next: res => {
          this.barGraph = res['data'];
          subSalesPerRep.unsubscribe();
        }, error: res => {
          subSalesPerRep.unsubscribe();
        }
      });
    }
  }
}
