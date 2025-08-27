import { Routes } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';
import {DashboardComponent} from './dashboard/dashboard.component';

import { UsersListComponent } from './users-list/users-list.component';
import { AddTaskFormComponent } from './add-task-form/add-task-form.component';
import { AuthGuard } from './auth-guard.guard';
import { LoginGuard } from './login-guard.guard';
import {TaskDetailsComponent} from './task-details//task-details.component'
export const routes: Routes = [
  { path: 'users/login', component: LoginFormComponent, canActivate: [LoginGuard]},
  { path: 'users/me/tasks', component: DashboardComponent, canActivate: [AuthGuard]  },
  { path: 'users/me/tasks/add-new-task', component: AddTaskFormComponent, canActivate: [AuthGuard]  },
  { path: 'users/me/tasks/:id', component: TaskDetailsComponent, canActivate: [AuthGuard]  },
  { path: 'users', component: UsersListComponent },
  { path: '', redirectTo: 'users', pathMatch: 'full' }
];
