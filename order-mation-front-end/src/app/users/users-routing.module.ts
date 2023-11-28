import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleComponent } from './role/role.component';
import { TargetComponent } from './target/target.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
      path: '',
      redirectTo: 'user',
      pathMatch: 'full',
    },
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: 'role',
    component: RoleComponent
  },
  {
    path: 'target',
    component: TargetComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
