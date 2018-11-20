import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  baseURL = "https://ems.aladinlabs.com/api/";

  post(url, data){
    return this.http.post(`${this.baseURL}${url}`, data)
  }
}
