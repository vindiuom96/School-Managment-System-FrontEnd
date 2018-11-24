import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AfterloginService } from './services/afterlogin.service';
import { BeforeloginService } from './services/beforelogin.service';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { UsersComponent } from './components/users/users.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { RequestResetComponent } from './components/password/request-reset/request-reset.component';
import { ResponseResetComponent } from './components/password/response-reset/response-reset.component';
import { SignupConfrimComponent } from './components/signup-confrim/signup-confrim.component';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate : [BeforeloginService]
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate : [BeforeloginService]
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'reset-password',
    component : RequestResetComponent,
    canActivate : [BeforeloginService]
  },
  {
    path: 'reset-password-submit',
    component : ResponseResetComponent,
    canActivate : [BeforeloginService]
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate : [BeforeloginService]
  },
  {
    path: 'signup/activate',
    component: SignupConfrimComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
