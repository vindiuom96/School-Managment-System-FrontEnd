import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { TokenService } from 'src/app/services/token.service';
import { WaitService } from 'src/app/services/wait.service';
import { SnotifyService } from 'ng-snotify';
import { ActivatedRoute } from '@angular/router';
import { RolesCheckService } from 'src/app/services/roles-check.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  isAdmin = false;
  isTeacher = false;
  isStudent = false;
  isParent = false;

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

  me = false;
  other = null;

  constructor(
    private api : ApiService,
    private token : TokenService,
    private wait : WaitService,
    private notify : SnotifyService,
    private route : ActivatedRoute,
    private roles : RolesCheckService
  ) { }

  private dataHandler(data){
    this.api.get('users/profile?user_id=' + data.id, this.headers).subscribe(
      data => { this.other = data; console.log(data); }
    );
    if(this.roles.isSuperAdmin || this.roles.isAdmin)
      this.me = true;
    this.user.address = data.address;
    this.user.email = data.email;
    this.user.name = data.name;
    this.user.about = data.about;
    this.user.avatar_url = data.avatar_url;
    this.user.id = data.id;
    console.log(data);
    this.role = data.roles[0].name;
    this.date = data.updated_at;
  }

  ngOnInit() {
    this.isAdmin = this.roles.isAdmin || this.roles.isSuperAdmin;
    this.isTeacher = this.roles.isTeacher;
    this.isStudent = this.roles.isStudent;
    this.isParent = this.roles.isParent;
    this.route.queryParams.subscribe(params => {
      if(params['id']){
        this.me = false;
        this.api.get('users/'+params['id'], this.headers).subscribe(
          data => this.dataHandler(data),
          error => console.log(error)
        );
      } else {
        this.me = true;
        this.api.get('auth/user', this.headers).subscribe(
          data => this.dataHandler(data),
          error => console.log(error)
        );
      }
    });
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
