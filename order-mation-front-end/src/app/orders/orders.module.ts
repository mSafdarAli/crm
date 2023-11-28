import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersRoutingModule } from './orders-routing.module';
import { SearchComponent } from './search/search.component';
import { RepeatComponent } from './repeat/repeat.component';
import { NewSearchComponent } from './search/new-search/new-search.component';
import { CurrentOrdersComponent } from './current-orders/current-orders.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { QuotesModule } from '../quotes/quotes.module';
import { RepeatOrderComponent } from './repeat/repeat-order/repeat-order.component';
import { DispatchNotesComponent } from './dispatch-notes/dispatch-notes.component';
import { DispatchPopupComponent } from './dispatch-notes/dispatch-popup/dispatch-popup.component';
import { ReceivingNotesComponent } from './receiving-notes/receiving-notes.component';
import { SearchPopupComponent } from './receiving-notes/search-popup/search-popup.component';
import { HistoryPopupComponent } from './receiving-notes/history-popup/history-popup.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { DateComponent } from './purchase-order/date/date.component';
import { AcceptOrderComponent } from './accept-order/accept-order.component';
import { BrandingPurchaseComponent } from './branding-purchase/branding-purchase.component';
import { FormControllerModule } from '../shared/form-controller/form-controller.module';
import { UpdateDateComponent } from './branding-purchase/update-date/update-date.component';
import { PrintComponent } from './purchase-order/print/print.component';
import { PrintBrandingPurchaseComponent } from './branding-purchase/print-branding-purchase/print-branding-purchase.component';




@NgModule({
  declarations: [
    SearchComponent,
    RepeatComponent,
    NewSearchComponent,
    CurrentOrdersComponent,
    OrderHistoryComponent,
    RepeatOrderComponent,
    DispatchNotesComponent,
    DispatchPopupComponent,
    ReceivingNotesComponent,
    SearchPopupComponent,
    HistoryPopupComponent,
    PurchaseOrderComponent,
    DateComponent,
    AcceptOrderComponent,
    BrandingPurchaseComponent,
    UpdateDateComponent,
    PrintComponent,
    PrintBrandingPurchaseComponent

  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    QuotesModule,
    FormControllerModule
  ]
})
export class OrdersModule { }
