import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private iss = {
    login : this.api.baseURL + 'login',
    signup : this.api.baseURL + 'signup'
  }
  constructor( private api : ApiService ) { }

  set(token){
    localStorage.setItem('token', token);
    //localStorage.setItem('user', JSON.stringify(token.user));
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
