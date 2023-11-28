import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionListComponent } from '../shared/form-controller/action-list/action-list.component';
import { CurrentComponent } from './current/current.component';
import { HistoryComponent } from './history/history.component';
import { BrandingDetailsComponent } from './new/branding-details/branding-details.component';
import { NewComponent } from './new/new.component';
import { PDFComponent } from './new/pdf/pdf.component';
import { SearchProductsComponent } from './new/search-products/search-products.component';
import { RepeatComponent } from './repeat/repeat.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: 'search-quotes',
    component: SearchComponent
  },
  {
    path: 'quotes-history',
    component: HistoryComponent
  },
  {
    path: 'repeat-quotes',
    component: RepeatComponent
  },
  {
    path: 'current-quotes',
    component: CurrentComponent
  },
  {
    path: 'new-quotes',
    component: NewComponent
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
export class QuotesRoutingModule { }
