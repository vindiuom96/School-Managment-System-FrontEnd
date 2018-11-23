import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';

import { TokenService } from '../../services/token.service'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users = null;
  host = this.api.host;
  error = [];
  keyword = null;
  pagination = {
    'page' :  '1',
    'max' : '10'
  }

  data = {
    "id" : null,
    "name" : null,
  }

  form = {
    name : null,
    email : null,
    password : null,
    password_confirmation : null,
  }

  headers = {
    'Authorization' : this.token.get()
  }

  constructor(private pg: NgbPaginationConfig, private token : TokenService, private http : HttpClient, private router : Router,private api : ApiService, private notify : SnotifyService) {
    pg.boundaryLinks = true;
    pg.rotate = true;
  }

  ngOnInit() {
    if(this.keyword)
      this.api.get('users?search=' + this.keyword + '&page=' + this.pagination.page, this.headers).subscribe(
        data => this.datahandler(data),
        error => { this.token.remove(); this.router.navigateByUrl("/login"); }
      );
    else
      this.api.get('users?page=' + this.pagination.page, this.headers).subscribe(
        data => this.datahandler(data),
        error => { this.token.remove(); this.router.navigateByUrl("/login"); }
      );
  }

  datahandler(data){
    console.log(data.data);
    this.users = data.data;
    this.pagination.max = data.total;
  }

  paginateClick(page){
    console.log(page);
    this.pagination.page = page;
    this.ngOnInit();
  }

  search(){
    this.ngOnInit();
  }

  pause(id){
    this.notify.clear();
    console.log(id);
    var body = {
      "id" : id
    }
    return this.api.post('users/pause', body, this.headers).subscribe(
      data => {this.notify.info("Success", {timeout: 2000}); this.ngOnInit(); },
      error => this.notify.error(error.message, {timeout: 0})
    );
  }

  noticebyid(data){
  }

  edit(id){
    this.notify.clear();
    this.data.name = null;
    this.api.get('users/'+id, this.headers).subscribe(
      data => this.data.name = data.name,
      error => this.notify.error("User Not Found", {timeout: 0})
    );
    this.data.id = id;
    var modal = document.getElementById('editModal');
    modal.style.display = "block";
  }

  editsubmit(){
    this.notify.clear();
    this.notify.info("Wait...", {timeout: 0});
    this.api.put('users/'+this.data.id, this.data, this.headers).subscribe(
      data => { this.notify.clear();; this.notify.info("User Updated Successfully", {timeout: 2000}); },
      error => { this.notify.clear(); this.notify.error("Update Failed", {timeout: 0})}
    );
    this.ngOnInit();
    this.closeEditModal();
  }

  closeEditModal(){
    var modal = document.getElementById('editModal');
    modal.style.display = "none";
  }

  delete(id){
    this.notify.clear();
    this.notify.warning('Are you sure you want to detele this User?', 'Delete User', {
      timeout: 0,
      showProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      buttons: [
        {text: 'Yes', action: () => {
          var headers = {
            'Authorization' : this.token.get()
          }
          return this.api.delete('users/'+id, headers).subscribe(
            data => {this.notify.info("Success", {timeout: 2000}); this.ngOnInit(); },
            error => this.notify.error(error.message, {timeout: 0})
          );
        }, bold: false},
        {text: 'No'}
      ]
    });
  }

  add(){
    this.notify.clear();
    var modal = document.getElementById('addModal');
    modal.style.display = "block";
  }

  addModalSubmit(){
    this.notify.clear();
    this.notify.info("Wait...", {timeout: 0});
    this.api.post('users', this.form, this.headers).subscribe(
      data => {
        this.notify.clear();
        this.notify.info("User Added Successfully", {timeout: 2000});
        this.ngOnInit();
        this.closeAddModal();
      },
      error => { this.notify.clear(); this.error = error.error.errors; }
    );

  }

  closeAddModal(){
    var modal = document.getElementById('addModal');
    modal.style.display = "none";
  }
}
