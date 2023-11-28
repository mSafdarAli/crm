import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotesRoutingModule } from './quotes-routing.module';
import { SearchComponent } from './search/search.component';
import { NewComponent } from './new/new.component';
import { CurrentComponent } from './current/current.component';
import { HistoryComponent } from './history/history.component';
import { RepeatComponent } from './repeat/repeat.component';
import { NewSearchComponent } from './search/new-search/new-search.component';
import { NewRepeatComponent } from './repeat/new-repeat/new-repeat.component';
import { SearchProductsComponent } from './new/search-products/search-products.component';
import { BrandingDetailsComponent } from './new/branding-details/branding-details.component';
import { QuotesPopupComponent } from './current/quotes-popup/quotes-popup.component';
import { ImagePreviewComponent } from './new/image-preview/image-preview.component';
import { FormControllerModule } from '../shared/form-controller/form-controller.module';
import { PDFComponent } from './new/pdf/pdf.component';
import { CheckStockComponent } from './new/check-stock/check-stock.component';



@NgModule({
  declarations: [
    SearchComponent,
    NewComponent,
    CurrentComponent,
    HistoryComponent,
    RepeatComponent,
    NewSearchComponent,
    NewRepeatComponent,
    SearchProductsComponent,
    BrandingDetailsComponent,
    QuotesPopupComponent,
    ImagePreviewComponent,
    PDFComponent,
    CheckStockComponent
  ],
  imports: [
    CommonModule,
    QuotesRoutingModule,
    FormControllerModule
  ],
  exports : [
    NewComponent
  ]
})
export class QuotesModule { }
