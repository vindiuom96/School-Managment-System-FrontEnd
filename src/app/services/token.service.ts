import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor( private api : ApiService ) { }

  set(token){
    localStorage.setItem('token', token);
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
  }

  loggedIn(){
    const token = this.get();
    if(token==null)
      return false;
    return true;
  }
}
