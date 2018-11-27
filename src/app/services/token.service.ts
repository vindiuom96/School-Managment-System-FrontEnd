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
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  checkRoles(role){
    let roles = [];
    //roles = localStorage.getItem('roles');
  }

  get(){
    return localStorage.getItem('token');
  }

  remove(){
    localStorage.removeItem('token');
  }

  loggedIn(){
    const token = this.get();
    if(token==null)
      return false;
    return true;
  }
}
