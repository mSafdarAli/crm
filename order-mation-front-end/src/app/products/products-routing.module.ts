import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandingComponent } from './branding/branding.component';
import { ColoursComponent } from './colours/colours.component';
import { PrintPositionsComponent } from './print-positions/print-positions.component';
import { ProductCategoriesComponent } from './product-categories/product-categories.component';
import { ProductComponent } from './product/product.component';
import { SizesComponent } from './sizes/sizes.component';
import { WeightsComponent } from './weights/weights.component';

const routes: Routes = [
  {
    path : 'product',
    component: ProductComponent
  },
  {
    path : 'categories',
    component: ProductCategoriesComponent
  },
  {
    path : 'branding',
    component: BrandingComponent
  },
  {
    path : 'print-positions',
    component: PrintPositionsComponent
  },  
  {
    path : 'sizes',
    component: SizesComponent
  },
  {
    path : 'weights',
    component: WeightsComponent
  },
  {
    path : 'colours',
    component: ColoursComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
