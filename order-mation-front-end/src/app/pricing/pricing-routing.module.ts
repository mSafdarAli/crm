import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExtrapriceComponent } from './extraprice/extraprice.component';
import { ImportComponent } from './import/import.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'import',
    pathMatch: 'full',
  },
  {
    path: 'import',
    component: ImportComponent
  },
  {
    path: 'extra-prices',
    component: ExtrapriceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricingRoutingModule { }
