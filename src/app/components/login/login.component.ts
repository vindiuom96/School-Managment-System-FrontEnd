import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { TokenService } from '../../services/token.service';
import { Router, Route } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SnotifyService } from 'ng-snotify';
import { HttpHeaders } from '@angular/common/http';
import { SliderComponent } from '../slider/slider.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loggedIn : boolean;

  public form = {
    email : null,
    password : null,
    remember_me : false
  };

  public error = null;

  constructor(
    private api : ApiService,
    private token : TokenService,
    private router : Router,
    private auth : AuthService,
    private notify: SnotifyService
    ) {}

  ngOnInit() {
  }

  onSubmit(){
    this.notify.info("Wait...", {timeout:0});
    var headers = {
      'Content-Type' : 'application/json'
    }
    return this.api.post('auth/login', this.form, headers).subscribe(
      data => this.tokenHandler(data),
      error => this.errorHandler(error.error)
    );
  }

  errorHandler(error){
    this.notify.clear();
    console.log(error);
    if(error.errors && error.errors.email){
      this.error = error.errors.email;
    }
    else if(error.message=="Unauthorized"){
      this.error = null;
      this.notify.error("Invalid Login Details or email not confirmed", {timeout:0})
    } else {
      this.error = null;
      this.notify.error(error.message, {timeout:0})
    }
  }

  tokenHandler(data){
    this.notify.clear();
    console.log(data);
    this.token.set(data.token_type + " " + data.access_token);
    this.token.setRoles(data.user.roles);
    this.auth.changeAuthStatus(true);
    this.loggedIn = true;
    this.router.navigateByUrl('/dashboard');
    this.notify.info("Login Succesfully", {timeout:2000});
    //window.location.reload();
  }

}
