import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private header = {
    'X-Requested-With' : 'XMLHttpRequest',
    'Authorization' : localStorage.getItem('token')
  }

  private users = {
    'name' : null,
    'email' : null,
    'img' : null
  };

  private dataHandler(data){
    console.log(data);
    this.users.name = data.name;
    this.users.email = data.email;
    this.users.img = this.api.host + data.avatar_url;
    localStorage.setItem('user', JSON.stringify(this.user))
    if(localStorage.getItem('user')==null || localStorage.getItem('user') == 'undefined'){
      this.wait(996);
    }
    return JSON.parse(localStorage.getItem('user'))
  }

  private wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }

  constructor(
    private api : ApiService
  ) { }

  user(){
    var data = JSON.parse(localStorage.getItem('user'));
    if (data!=null)
      return data;
    this.api.get('auth/user', this.header).subscribe(
      data => { this.dataHandler(data) },
      error => { console.log(error) }
    );
  }
}
