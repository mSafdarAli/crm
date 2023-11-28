import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NgChartsModule as ChartModule } from 'ng2-charts';
import { LinechartComponent } from './linechart/linechart.component';
import { BarchartComponent } from './barchart/barchart.component';
import { FormControllerModule } from '../shared/form-controller/form-controller.module';





@NgModule({
  declarations: [
    DashboardComponent,
    LinechartComponent,
    BarchartComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ChartModule,
    FormControllerModule
  ]
})
export class DashboardModule { }
