import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductComponent } from './product/product.component';
import { ProductCategoriesComponent } from './product-categories/product-categories.component';
import { BrandingComponent } from './branding/branding.component';
import { PrintPositionsComponent } from './print-positions/print-positions.component';
import { SizesComponent } from './sizes/sizes.component';
import { WeightsComponent } from './weights/weights.component';

import { ProductPopupComponent } from './product/product-popup/product-popup.component';
import { CategoryPopupComponent } from './product-categories/category-popup/category-popup.component';
import { BrandingPopupComponent } from './branding/branding-popup/branding-popup.component';
import { PositionPopupComponent } from './print-positions/position-popup/position-popup.component';
import { SizePopupComponent } from './sizes/size-popup/size-popup.component';
import { WeightPopupComponent } from './weights/weight-popup/weight-popup.component';
import { ColourPopupComponent } from './colours/colour-popup/colour-popup.component';
import { ColoursComponent } from './colours/colours.component';
import { FormControllerModule } from '../shared/form-controller/form-controller.module';




@NgModule({
  declarations: [
    ProductComponent,
    ProductCategoriesComponent,
    BrandingComponent,
    PrintPositionsComponent,    
    SizesComponent,
    WeightsComponent,
    ProductPopupComponent,
    CategoryPopupComponent,
    BrandingPopupComponent,
    PositionPopupComponent,
    SizePopupComponent,
    WeightPopupComponent,
    ColoursComponent,
    ColourPopupComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    FormControllerModule
  ]
})
export class ProductsModule { }
