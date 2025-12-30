import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register';
import { Login } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { authGuard } from './auth.guard';
import { AdminManageComponent } from './admin-manage/admin-manage';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'admin/manage', component: AdminManageComponent, canActivate: [authGuard] },
];