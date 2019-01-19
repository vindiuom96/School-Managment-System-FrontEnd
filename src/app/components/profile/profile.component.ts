import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { TokenService } from 'src/app/services/token.service';
import { WaitService } from 'src/app/services/wait.service';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user = {
    'name' : null,
    'avatar_url' : null,
    'about' : null,
    'address' : null,
    'email' : null,
    'id' : null,
    'school' : null
  }
  role = null
  date = null

  error = {
    'address' : null,
    'email' : null,
    'name' : null,
    'about' : null
  };

  private headers = {
    'Authorization' : this.token.get(),
    'X-Requested-With' : 'XMLHttpRequest'
  }

  constructor(
    private api : ApiService,
    private token : TokenService,
    private wait : WaitService,
    private notify : SnotifyService
  ) { }

  private dataHandler(data){
    this.user.address = data.address;
    this.user.email = data.email;
    this.user.name = data.name;
    this.user.about = data.about;
    this.user.avatar_url = data.avatar_url;
    this.user.id = data.id;
    console.log(data);
    this.role = JSON.parse(localStorage.getItem('roles'))[0];
    this.date = data.updated_at;
  }

  ngOnInit() {
    this.api.get('auth/user', this.headers).subscribe(
      data => this.dataHandler(data),
      error => console.log(error)
    )
    for(var i=0; i<10; i++){
      if(this.user!=null){
        break;
      }
      this.wait.ms(1001)
    }
  }

  submit(){
    this.notify.clear();
    this.notify.info("Wait...", {timeout: 0});
    this.api.put('users/'+this.user.id, this.user, this.headers).subscribe(
      data => {
        this.notify.clear();
        this.notify.info("User Updated Successfully", {timeout: 2000});
        this.ngOnInit();
      },
      error => { this.notify.clear(); this.error = error.error.errors; }
    );
  }

}