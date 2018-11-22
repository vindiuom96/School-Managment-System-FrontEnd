import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import {SnotifyService} from 'ng-snotify';

@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.component.html',
  styleUrls: ['./request-reset.component.css']
})
export class RequestResetComponent implements OnInit {

  public form = {
    email : null
  };

  public error = null;

  constructor(
    private api : ApiService,
    private notify : SnotifyService
    ) {}

  ngOnInit() {
  }

  onSubmit(){
    this.notify.clear();
    var header = {
      'Content-Type': 'application/json'
    }
    this.notify.info('Wait...', {timeout:0});
    return this.api.post('password/create', this.form, header).subscribe(
      data => this.datahandler(data),
      error => this.errorHandler(error.error)
    );
  }

  datahandler(data){
    this.notify.clear();
    this.notify.info(data.message);
  }

  errorHandler(error){
    this.notify.clear();
    console.log(error);
    if(error.errors && error.errors.email){
      this.error = error.errors.email;
    } else {
      this.error = null;
      this.notify.error(error.message, {timeout:0})
    }
    this.form.email = null;
  }

}
