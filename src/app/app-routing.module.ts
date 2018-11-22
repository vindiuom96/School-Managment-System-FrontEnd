import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AfterloginService } from './services/afterlogin.service';
import { BeforeloginService } from './services/beforelogin.service';

import { NavComponent } from './components/nav/nav.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate : [BeforeloginService]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate : [AfterloginService]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }