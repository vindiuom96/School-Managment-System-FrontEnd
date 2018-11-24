import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { TokenService } from '../../../services/token.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-response-reset',
  templateUrl: './response-reset.component.html',
  styleUrls: ['./response-reset.component.css']
})
export class ResponseResetComponent implements OnInit {

  public error = null;
  public form = {
    email : null,
    password : null,
    password_confirmation : null,
    token : null
  };

  constructor(
    private api : ApiService,
    private router : Router,
    private notify: SnotifyService,
    private route : ActivatedRoute
  ) {
    route.queryParams.subscribe(params => {
      this.form.token = params['token'];
    })
  }

  ngOnInit() {
  }

  onSubmit(){
    this.notify.clear();
    this.notify.info('Wait...', {timeout:0});
    var header = {
      'Content-Type': 'application/json'
    }
    return this.api.get('password/find/'+this.form.token, header).subscribe(
      data => this.resetHandler(data),
      error => this.handleerror(error.error)
    );
  }

  handleerror(error){
    console.log(error);
    this.notify.clear();
    if(error.errors && error.errors.password){
      this.error = error.errors.password;
    } else
      this.notify.error(error.message, {timeout:0});
  }

  resetHandler(data){
    this.notify.clear();
    console.log(data);
    if(data.email == this.form.email){
      this.notify.info('Wait...', {timeout:0});
      var header = {
        'Content-Type': 'application/json'
      }
      return this.api.post('password/reset', this.form, header).subscribe(
        data => {
          this.notify.clear();
          this.notify.info('Password Reset Successfully', {timeout:2000});
          this.router.navigateByUrl('/login');
        },
        error => this.handleerror(error.error)
      );
    } else {
      this.notify.error("Incorrect Email", {timeout:0});
    }
  }
}
