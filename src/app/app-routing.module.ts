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
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { EditProjectComponent } from './components/edit-project/edit-project.component';
import { SettingsComponent } from './components/settings/settings.component';
import { EditCategoryComponent } from './components/edit-category/edit-category.component';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';

const routes: Routes = [
  { path: "", redirectTo: '/projects', pathMatch: 'full' },
  { path: "dashboard", redirectTo: '/projects', pathMatch: 'full' },
  { path: "login", component: LoginComponent },
  { path: "settings", component: SettingsComponent, canActivate: [SuperAdminGuard] },
  { path: "category/edit/:id", component: EditCategoryComponent, canActivate: [SuperAdminGuard] },
  // User Management ----------------------------------------------------------------------
  { path: "users", component: DashUsersComponent, canActivate: [SuperAdminGuard] },
  { path: "users/:uid", component: UserDetailsComponent, canActivate: [SuperAdminGuard] },
  { path: "user/add", component: AddUserComponent, canActivate: [SuperAdminGuard] },
  { path: "user/edit/:uid", component: EditUserComponent, canActivate: [SuperAdminGuard] },
  // Project Management --------------------------------------------------------------------
  { path: "projects", component: DashProjectsComponent, canActivate: [AuthGuard] },
  { path: "projects/:id", component: ProjectDetailsComponent, canActivate: [AuthGuard] },
  { path: "project/add", component: AddProjectComponent, canActivate: [SuperAdminGuard] },
  { path: "project/edit/:id", component: EditProjectComponent, canActivate: [SuperAdminGuard] },
  //----------------------------------------------------------------------------------------
  { path: "**", component: PageNotFoundComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers : [AuthGuard, SuperAdminGuard]
})
export class AppRoutingModule { }

export const routingComponents = [DashUsersComponent, DashProjectsComponent, PageNotFoundComponent, AddUserComponent, AddProjectComponent, LoginComponent, EditUserComponent, UserDetailsComponent, EditProjectComponent, ProjectDetailsComponent, SettingsComponent, EditCategoryComponent];