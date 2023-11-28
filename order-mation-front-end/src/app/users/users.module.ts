import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { TargetComponent } from './target/target.component';
import { NewComponent } from './user/new/new.component';
import { NewRoleComponent } from './role/new-role/new-role.component';

import { NewTargetComponent } from './target/new-target/new-target.component';
import { FormControllerModule } from '../shared/form-controller/form-controller.module';

@NgModule({
  declarations: [
    UserComponent,
    RoleComponent,
    TargetComponent,
    NewComponent,
    NewRoleComponent,
    NewTargetComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormControllerModule
  ],
  providers: [
    
	]
})
export class UsersModule { }
