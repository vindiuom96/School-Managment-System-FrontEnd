import { Component, OnInit } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public loggedIn : boolean;

  constructor(
    private auth : AuthService,
    private router : Router,
    private token : TokenService,
    private notify : SnotifyService
  ) { }

  ngOnInit() {
    this.auth.authStatus.subscribe(value => this.loggedIn = value);
    console.log(this.loggedIn);
  }

  logout(Event = MouseEvent){
    event.preventDefault;

    this.token.remove();
    this.auth.changeAuthStatus(false);
    this.router.navigateByUrl('/login');
    location.reload();
    this.notify.info("Logout Succesfully", {timeout:2000});
  }

}
