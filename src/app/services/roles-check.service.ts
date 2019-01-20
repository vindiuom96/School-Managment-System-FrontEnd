import { Injectable } from '@angular/core';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class RolesCheckService {

  isAdmin = false;
  isTeacher = false;
  isStudent = false;
  isParent = false;
  isSuperAdmin = false;

  constructor(private token : TokenService) {
    if(this.token.checkRole('Admin'))
      this.isAdmin = true;
    if(this.token.checkRole('Teacher'))
      this.isTeacher = true;
    if(this.token.checkRole('Student'))
      this.isStudent = true;
    if(this.token.checkRole('Parent'))
      this.isParent = true;
    if(this.token.checkRole('SuperAdmin'))
      this.isSuperAdmin = true;
  }
}
