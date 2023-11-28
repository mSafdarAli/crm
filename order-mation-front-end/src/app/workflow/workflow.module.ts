import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowRoutingModule } from './workflow-routing.module';
import { CurrentTaskComponent } from './task/current-task/current-task.component';
import { TaskHistoryComponent } from './task/task-history/task-history.component';
import { TaskComponent } from './task/task.component';
import { OverrideComponent } from './override/override.component';
import { NewOverrideComponent } from './override/new-override/new-override.component';
import { AssigntoPopupComponent } from './task/current-task/assignto-popup/assignto-popup.component';
import { CurrentComplaintsComponent } from './complaints/current-complaints/current-complaints.component';
import { ComplaintsHistoryComponent } from './complaints/complaints-history/complaints-history.component';
import { NewComponent } from './complaints/current-complaints/new/new.component';
import { FormControllerModule } from '../shared/form-controller/form-controller.module';
import { NewtaskPopupComponent } from './task/newtask-popup/newtask-popup.component';
import { AttachmentsComponent } from './complaints/attachments/attachments.component';





@NgModule({
  declarations: [
    CurrentComplaintsComponent,
    ComplaintsHistoryComponent,
    CurrentTaskComponent,
    TaskHistoryComponent,
    TaskComponent,
    OverrideComponent,
    NewOverrideComponent,
    AssigntoPopupComponent,   
    CurrentTaskComponent,
    NewComponent,
    NewtaskPopupComponent,
    AttachmentsComponent
  ],
  imports: [
    CommonModule,
    WorkflowRoutingModule,
    FormControllerModule
  ]
})
export class WorkflowModule { }
