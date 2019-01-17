import { Component, OnInit } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { RolesCheckService } from 'src/app/services/roles-check.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  loggedIn : boolean;

  isAdmin = false;
  isTeacher = false;
  isStudent = false;
  isParent = false;

  constructor(
    private role : RolesCheckService,
    private auth : AuthService,
    private router : Router,
    private token : TokenService,
    private notify : SnotifyService
  ) { }

  ngOnInit() {
    this.isAdmin = this.role.isAdmin;
    this.isTeacher = this.role.isTeacher;
    this.isStudent = this.role.isStudent;
    this.isParent = this.role.isParent;
    this.auth.authStatus.subscribe(
      value => this.loggedIn = value
    );
    console.log(this.loggedIn);
  }

  logout(Event = MouseEvent){
    event.preventDefault;
    this.loggedIn = false;
    this.token.remove();
    this.auth.changeAuthStatus(false);
    this.router.navigateByUrl('/login');
    this.notify.info("Logout Succesfully", {timeout:2000});
  }
}
