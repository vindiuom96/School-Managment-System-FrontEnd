import { Component, OnInit } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { RolesCheckService } from 'src/app/services/roles-check.service';
import { UserService } from 'src/app/services/user.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public loggedIn : boolean;
  public user = {
    'name' : null,
    'email' : null,
    'img' : null
  };

  isAdmin = false;
  isTeacher = false;
  isStudent = false;
  isParent = false;

  constructor(
    private role : RolesCheckService,
    private auth : AuthService,
    private router : Router,
    private token : TokenService,
    private notify : SnotifyService,
    private users : UserService,
    private api : ApiService
  ) { }

  headers = {     //Token for API Authorization
    'Authorization' : this.token.get(),
    'X-Requested-With' : 'XMLHttpRequest'
  }

  ngOnInit() {
    this.user = {
      'name' : null,
      'email' : null,
      'img' : null
    };
    this.isAdmin = this.role.isAdmin;
    this.isTeacher = this.role.isTeacher;
    this.isStudent = this.role.isStudent;
    this.isParent = this.role.isParent;
    this.auth.authStatus.subscribe(
      value => this.loggedIn = value
    );
    console.log(this.loggedIn);
    if(this.loggedIn){
      if(this.users.user()==null || this.users.user() == 'undefined'){
        this.wait(1006);
      }
      this.user = this.users.user();
    }

    this.api.get('notices?student_id=' + localStorage.getItem('student_id'), this.headers).subscribe(
      data => this.datahandler(data)
    );
  }

  unread = [];
  unreadCount = 0;
  datahandler(data){
    this.notify.clear();
    console.log(data);

    for(var i=0; i<data.length; i++){
      if(data[i].status=='false'){
        this.unread.push(data[i]);
      }
    }
    if(this.unread.length>0){
      this.unreadCount = this.unread.length;
    }
    console.log(this.unread);
  }

  read(){
    this.unreadCount = 0;
    for(var i=0; i<this.unread.length; i++){
      this.api.get('notices/read?notice_id=' + this.unread[i].id, this.headers).subscribe(
      );
    }
  }

  private wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
    }
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
