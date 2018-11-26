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
  private loggedIn : boolean;
  private isCollapsed: Boolean = true;
  private _opened: boolean = false;
  //private prevdata = null;

  constructor(
    private auth : AuthService,
    private router : Router,
    private token : TokenService,
    private notify : SnotifyService
  ) { }

  ngOnInit() {
    this.auth.authStatus.subscribe(
      value => this.loggedIn = value
    );
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

  toggle(){
    this._opened = !this._opened;
  }

  subtoggle(data){
    console.log('clicked');
    var t = document.getElementsByClassName(data);
    //t[0].parentElement.className = t[0].parentElement.className.replace(/\bactive\b/g, "");
    for(var i=0; i<t.length; i++){
      var visibility = this.getElement(t[i]);
      if(visibility == 'none')
        this.changeDisplay(t[i], "block");
      else
      this.changeDisplay(t[i], "none");
    }
    //this.prevdata = data;
  }

  changeDisplay(element, data){
    element.style.display = data
  }

  getElement(element){
    return element.style.display;
  }

}
