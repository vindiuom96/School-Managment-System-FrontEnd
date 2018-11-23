import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  host = "http://127.0.0.1:8000";
  baseURL = this.host + "/api/";

  post(url, data, headers){
    return this.http.post(`${this.baseURL}${url}`, data, { headers: new HttpHeaders(headers) } )
  }

  get(url, headers){
    return this.http.get(`${this.baseURL}${url}`, { headers: new HttpHeaders(headers) } )
  }

  delete(url,headers){
    return this.http.delete(`${this.baseURL}${url}`, { headers: new HttpHeaders(headers) } )
  }

  put(url, data, headers){
    return this.http.put(`${this.baseURL}${url}`, data, { headers: new HttpHeaders(headers) } )
  }
}
