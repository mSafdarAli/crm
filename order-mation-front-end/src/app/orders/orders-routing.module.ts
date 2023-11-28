import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionListComponent } from '../shared/form-controller/action-list/action-list.component';
import { BrandingPurchaseComponent } from './branding-purchase/branding-purchase.component';
import { CurrentOrdersComponent } from './current-orders/current-orders.component';
import { DispatchNotesComponent } from './dispatch-notes/dispatch-notes.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { ReceivingNotesComponent } from './receiving-notes/receiving-notes.component';
import { RepeatComponent } from './repeat/repeat.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: 'repeat-orders',
    component: RepeatComponent
  },
  {
    path: 'search-orders',
    component: SearchComponent
  },
  {
    path: 'current-orders',
    component: CurrentOrdersComponent
  },
  {
    path: 'order-history',
    component: OrderHistoryComponent
  },
  {
    path: 'dispatch-notes/:id',
    component: DispatchNotesComponent
  },
  {
    path: 'receiving-notes/:id',
    component: ReceivingNotesComponent
  },
  {
    path: 'purchase-orders/:id',
    component: PurchaseOrderComponent
  },
  {
    path: 'branding-purchase-orders/:id',
    component: BrandingPurchaseComponent
  },
  {
    path: 'action-list/:id',
    component: ActionListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
