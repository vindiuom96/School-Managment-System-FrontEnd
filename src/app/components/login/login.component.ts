import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { TokenService } from '../../services/token.service';
import { Router, Route } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SnotifyService } from 'ng-snotify';

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

  student = null;
  name = null;
  students = null;

  public error = null;

  constructor(
    private api : ApiService,
    private token : TokenService,
    private router : Router,
    private auth : AuthService,
    private notify: SnotifyService
    ) {}

  ngOnInit() {
    if(this.token.loggedIn)
      this.router.navigateByUrl('/dashboard');
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
    this.students = null;
    this.notify.clear();
    console.log(data);
    this.token.setRoles(data.user.roles);
    this.token.set(data.token_type + " " + data.access_token, data);
    if(data.user.roles[0].name=='Parent'){
      this.students = data.user.parent.student;
      this.add();
    } else {
      this.auth.changeAuthStatus(true);
      this.loggedIn = true;
      this.notify.info("Login Succesfully", {timeout:2000});
      this.wait(999);
      this.router.navigateByUrl('/dashboard');
      window.location.reload();
    }
  }

  add(){
    this.notify.clear();
    this.name = null;
    var modal = document.getElementById('addModal');
    modal.style.display = "block";
  }

  addModalSubmit(){
    this.notify.clear();
    this.notify.info("Wait...", {timeout: 0});
    localStorage.setItem('student_id', this.name);
    this.auth.changeAuthStatus(true);
    this.loggedIn = true;
    this.notify.info("Login Succesfully", {timeout:2000});
    this.wait(999);
    this.router.navigateByUrl('/dashboard');
    window.location.reload();

  }

  closeAddModal(){
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('user');
    localStorage.removeItem('student_id');
    var modal = document.getElementById('addModal');
    modal.style.display = "none";
  }

  private wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
    }
  }

}
