import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { DashUsersComponent } from './components/dash-users/dash-users.component';
import { DashProjectsComponent } from './components/dash-projects/dash-projects.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { LoginComponent } from './components/login/login.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';

// Guards
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: "", redirectTo: '/projects', pathMatch: 'full' },
  { path: "dashboard", redirectTo: '/projects', pathMatch: 'full' },
  { path: "login", component: LoginComponent },
  // User Management ------------------------------------------------------------------
  { path: "users", component: DashUsersComponent, canActivate: [AuthGuard] },
  { path: "users/add", component: AddUserComponent, canActivate: [AuthGuard] },
  { path: "users/edit/:uid", component: EditUserComponent, canActivate: [AuthGuard] },
  { path: "users/:uid", component: UserDetailsComponent, canActivate: [AuthGuard] },
  // Project Management ---------------------------------------------------------------
  { path: "projects", component: DashProjectsComponent, canActivate: [AuthGuard] },
  { path: "projects/add", component: AddProjectComponent, canActivate: [AuthGuard] },
  { path: "**", component: PageNotFoundComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers : [AuthGuard]
})
export class AppRoutingModule { }

export const routingComponents = [DashUsersComponent, DashProjectsComponent, PageNotFoundComponent, AddUserComponent, AddProjectComponent, LoginComponent, EditUserComponent, UserDetailsComponent];