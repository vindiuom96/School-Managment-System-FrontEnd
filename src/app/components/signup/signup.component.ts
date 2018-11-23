import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public form = {
    name : null,
    email : null,
    password : null,
    password_confirmation : null,
    terms : false
    // role : null
  };

  public error = [];

  constructor(
    private api : ApiService,
    private token : TokenService,
    private router : Router,
    private notify : SnotifyService
    ) { }

  ngOnInit() {
  }

  onSubmit(){
    this.notify.clear();
    this.notify.info('Wait...', {timeout:0});
    var header = {
      'Content-Type': 'application/json'
    }
    return this.api.post('auth/signup', this.form, header).subscribe(
      data => this.tokenHandler(data),
      error => this.errorHandle(error)
    );
  }

  tokenHandler(data){
    this.notify.clear();
    console.log(data);
    this.notify.info(data.message, {timeout:2000});
    this.notify.info("Please Confirm Email Address", {timeout:0});
    this.router.navigateByUrl('/login');
  }

  errorHandle(error){
    this.notify.clear();
    console.log(error);
    this.error = error.error.errors;
  }

}
