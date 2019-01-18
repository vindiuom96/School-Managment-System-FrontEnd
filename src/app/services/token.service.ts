import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private header = {
    'X-Requested-With' : 'XMLHttpRequest',
    'Authorization' : this.get()
  }

  private user = {
    'name' : null,
    'email' : null,
    'img' : null
  };

  constructor( private api : ApiService ) { }
  set(token, data){
    this.user = {
      'name' : null,
      'email' : null,
      'img' : null
    };
    localStorage.setItem('token', token);
    this.user.name = data.user.name;
    this.user.email = data.user.email;
    this.user.img = this.api.host + data.user.avatar_url;
    localStorage.setItem('user', JSON.stringify(this.user))
  }

  setRoles(roles){
    if(roles){
      var data = [roles[0].name];
      for(var i=1; i<roles.length; i++){
        data.push(roles[i].name);
      }
      localStorage.setItem('roles', JSON.stringify(data));
    } else {
      localStorage.setItem('roles', '');
    }
  }

  checkRole(role : string){
    let roles = JSON.parse(localStorage.getItem('roles'));
    if(!roles)
      return false;
    for(var i=0; i<roles.length; i++){
      if(roles[i]==role)
        return true;
      return false;
    }
  }

  getRoles(){
    return JSON.parse(localStorage.getItem('roles'));
  }

  get(){
    return localStorage.getItem('token');
  }

  remove(){
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('user');
  }

  loggedIn(){
    const token = this.get();
    if(token==null)
      return false;
    return true;
  }
}
