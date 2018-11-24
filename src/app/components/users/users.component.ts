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

  users = null;     //Store API Data
  error = [];       //Form errors
  keyword = null;   //Current Search Keyword
  pagination = {    //Current Pagination data
    'page' :  '1',
    'max' : '10'
  }

  data = {          //User Update Data
    "id" : null,
    "name" : null,
  }

  form = {         //New User add Data
    name : null,
    email : null,
    password : null,
    password_confirmation : null,
  }

  headers = {     //Token for API Authorization
    'Authorization' : this.token.get()
  }

  sortData = {        //Current Sort Data
    "col" : null,
    "order" : null
  }

  constructor(private pg: NgbPaginationConfig, private token : TokenService, private http : HttpClient, private router : Router,private api : ApiService, private notify : SnotifyService) {
    pg.boundaryLinks = true;
    pg.rotate = true;
  }

  ngOnInit() {
    this.notify.clear();
    this.notify.info("Loading...", {timeout: 0});
    if(this.keyword)
      this.api.get('users?search=' + this.keyword + '&page=' + this.pagination.page + '&sort=' + this.sortData.col + '&order=' + this.sortData.order, this.headers).subscribe(
        data => this.datahandler(data),
        error => { this.notify.clear(); this.token.remove(); this.router.navigateByUrl("/login"); }
      ); else
      this.api.get('users?page=' + this.pagination.page + '&sort=' + this.sortData.col + '&order=' + this.sortData.order, this.headers).subscribe(
        data => this.datahandler(data),
        error => { this.token.remove(); this.router.navigateByUrl("/login"); }
      );
  }

  datahandler(data){
    console.log(data.data);
    this.notify.clear();
    this.users = data.data;
    this.pagination.max = data.total;
  }

  //sort handler
  sort(col){
    console.log(col);
    if(this.sortData.order=="asc" && this.sortData.col==col){
      this.sortData.order = "desc"
    } else if(this.sortData.order=="desc" && this.sortData.col==col){
      this.sortData.order = null;
      col = null;
    } else {
      this.sortData.order = "asc"
    }
    this.sortData.col = col;
    this.ngOnInit();
  }

  //Paginate Handling
  paginateClick(page){
    console.log(page);
    this.pagination.page = page;
    this.ngOnInit();
  }

  //Serach Handling
  search(){
    this.ngOnInit();
  }

  //Pause or Active User Handling
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

  //User edit Handling
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
      data => {
        this.notify.clear();
        this.notify.info("User Updated Successfully", {timeout: 2000});
        this.ngOnInit();
        this.closeEditModal();
      },
      error => { this.notify.clear(); this.error = error.error.errors; }
    );
  }

  closeEditModal(){
    this.error = [];
    var modal = document.getElementById('editModal');
    modal.style.display = "none";
  }

  //User delete Handling
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

  //New User add Handling
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
    this.error = [];
    var modal = document.getElementById('addModal');
    modal.style.display = "none";
  }
}
