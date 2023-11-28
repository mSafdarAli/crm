import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionTypesComponent } from './action-types/action-types.component';
import { CategoriesComponent } from './categories/categories.component';
import { ColoursComponent } from '../products/colours/colours.component';
import { CustomersComponent } from './customers/customers.component';
import { EmailManagerComponent } from './email-manager/email-manager.component';
import { RemaindersComponent } from './remainders/remainders.component';
import { SettingsComponent } from './settings/settings.component';
import { SuppliersComponent } from './suppliers/suppliers.component';

const routes: Routes = [
  {
    path : '',
    redirectTo : 'customers',
    pathMatch:'full'
  }
  ,
  {
    path  : 'customers',
    component: CustomersComponent
  },
  {
    path  : 'categories',
    component: CategoriesComponent
  },
  {
    path  : 'suppliers',
    component: SuppliersComponent
  },
  {
    path  : 'action-types',
    component: ActionTypesComponent
  },
  {
    path  : 'email-manager',
    component: EmailManagerComponent
  },
  {
    path  : 'reminders',
    component: RemaindersComponent
  },
  {
    path  : 'settings',
    component: SettingsComponent
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralRoutingModule { }
