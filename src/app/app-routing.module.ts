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
import { RolesComponent } from './components/roles/roles.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { LocationMapComponent } from './components/location-map/location-map.component';
import { LocationComponent } from './components/location/location.component';
import { ProfileComponent } from './components/profile/profile.component';

const appRoutes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
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
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'roles',
    component: RolesComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'permissions',
    component: PermissionsComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'attendance',
    component: AttendanceComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'location',
    component: LocationComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'locationMap',
    component: LocationMapComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'profile',
    component: ProfileComponent,
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
