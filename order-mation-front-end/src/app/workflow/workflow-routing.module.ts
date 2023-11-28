import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentTaskComponent } from './task/current-task/current-task.component';
import { OverrideComponent } from './override/override.component';
import { TaskHistoryComponent } from './task/task-history/task-history.component';
import { CurrentComplaintsComponent } from './complaints/current-complaints/current-complaints.component';
import { ComplaintsHistoryComponent } from './complaints/complaints-history/complaints-history.component';
import { NewComponent } from './complaints/current-complaints/new/new.component';
import { TaskComponent } from './task/task.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'action-list',
    pathMatch: 'full'
  },
  {
    path: 'current-complaint',
    component: CurrentComplaintsComponent
  },
  {
    path: 'complaint-history',
    component: ComplaintsHistoryComponent
  },
  {
    path: 'task',
    component: TaskComponent
  },  
  {
    path: 'task-history',
    component: TaskHistoryComponent
  },
  {
    path: 'current-task',
    component: CurrentTaskComponent
  },
  {
    path: 'override',
    component: OverrideComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowRoutingModule { }
