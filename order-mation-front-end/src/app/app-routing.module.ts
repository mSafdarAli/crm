import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/_services/auth.guard';
import { FullWindowComponent } from './full-window/full-window.component';
import { NarrowWindowComponent } from './narrow-window/narrow-window.component';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: '/dashboard',
  //   pathMatch: 'full',
  // },
  {
    path: '',
    component: FullWindowComponent,
    children: [
      {
        path: "",
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
      }
    ]
  },
  {
    path: '',
    component: NarrowWindowComponent,
    children: [
      {
        path: "",
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard]
      },
      {
        path: "users",
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
      },
      {
        path: "pricing",
        loadChildren: () => import('./pricing/pricing.module').then(m => m.PricingModule)
      },
      {
        path: "general",
        loadChildren: () => import('./general/general.module').then(m => m.GeneralModule)
      },
      {
        path: "products",
        loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
      },
      {
        path: "quotes",
        loadChildren: () => import('./quotes/quotes.module').then(m => m.QuotesModule)
      },
      {
        path: "orders",
        loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule)
      },
      {
        path: "workflow",
        loadChildren: () => import('./workflow/workflow.module').then(m => m.WorkflowModule)
      }
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
