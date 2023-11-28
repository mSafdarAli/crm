import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PricingRoutingModule } from './pricing-routing.module';
import { ImportComponent } from './import/import.component';
import { ExtrapriceComponent } from './extraprice/extraprice.component';

import { NewComponent } from './extraprice/new/new.component';
import { NewExportComponent } from './import/new-export/new-export.component';
import { FormControllerModule } from '../shared/form-controller/form-controller.module';



@NgModule({
  declarations: [
    ImportComponent,
    ExtrapriceComponent,
    NewComponent,
    NewExportComponent
  ],
  imports: [
    CommonModule,
    PricingRoutingModule,
    FormControllerModule
  ]
})
export class PricingModule { }
