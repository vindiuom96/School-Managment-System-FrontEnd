import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { SnotifyService } from 'ng-snotify';
import { Router, ActivatedRoute } from '@angular/router';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';

import { TokenService } from '../../services/token.service'
import { RolesCheckService } from 'src/app/services/roles-check.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users = null;     //Store Users Data
  roles = null;     //Store all roles Data

  public error = {
    'role' : null,
    'email' : null,
    'name' : null,
    'password' : null
  };
       //Form errors
  keyword = null;   //Current Search Keyword
  pagination = {    //Current Pagination data
    'page' :  '1',
    'max' : '10'
  }
  role = null;
  User = 'User';

  data = {          //User Update Data
    "id" : null,
    "name" : null,
    "role" : []
  }

  form = {         //New User add Data
    'name' : null,
    'email' : null,
    'password' : null,
    'password_confirmation' : null,
    'role' : []
  }

  headers = {     //Token for API Authorization
    'Authorization' : this.token.get(),
    'X-Requested-With' : 'XMLHttpRequest'
  }

  sortData = {        //Current Sort Data
    "col" : null,
    "order" : null
  }

  isAdmin = false;

  constructor(private roleManage : RolesCheckService , private route : ActivatedRoute, private pg: NgbPaginationConfig, private token : TokenService, private http : HttpClient, private router : Router,private api : ApiService, private notify : SnotifyService) {
    pg.boundaryLinks = true;
    pg.rotate = true;
  }

  ngOnInit() {
    this.isAdmin = this.roleManage.isAdmin;
    if(!this.isAdmin){
      this.notify.error("Permission Denited");
      this.router.navigateByUrl("/dashboard");
    }
    this.route.queryParams.subscribe(params => {
      if(params['role']){
        this.role = params['role'];
        this.User = this.role;
      } else {
        this.User = 'User';
        this.role = '';
      }
    })
    this.notify.clear();
    this.notify.info("Loading...", {timeout: 0});

    if(this.keyword) {
      this.api.get('users?search=' + this.keyword + '&page=' + this.pagination.page + '&sort=' + this.sortData.col + '&order=' + this.sortData.order + '&role=' + this.role, this.headers).subscribe(
        data => this.datahandler(data),
        error => { this.notify.clear(); this.token.remove(); this.router.navigateByUrl("/login"); }
      );
    } else {
      this.api.get('users?page=' + this.pagination.page + '&sort=' + this.sortData.col + '&order=' + this.sortData.order + '&role=' + this.role, this.headers).subscribe(
        data => this.datahandler(data),
        error => { this.token.remove(); this.router.navigateByUrl("/login"); }
      );
    }
    this.api.get('role', this.headers).subscribe(
      data => { console.log(data); this.roles=data; },
      error => { this.notify.clear(); this.notify.error(error.error.message); }
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
    this.data.role = [];
    this.api.get('users/'+id, this.headers).subscribe(
      data => this.editDataHandler(data),
      error => this.notify.error("User Not Found", {timeout: 0})
    );
    this.data.id = id;
    var modal = document.getElementById('editModal');
    modal.style.display = "block";
  }

  editDataHandler(data){
    console.log(data);
    this.data.name = data.name;
    for(var i=0; i<data.roles.length; i++)
      this.data.role.push(data.roles[i].name);
  }

  checkbox(event){
    if(event.srcElement.checked){
      this.data.role.push(event.srcElement.name);
    } else {
      var index =this.data.role.indexOf(event.srcElement.name);
      this.data.role.splice(index, index+1);
    }
    console.log(this.data.role);
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
    this.error = {
      'role' : null,
      'email' : null,
      'name' : null,
      'password' : null
    };
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

    this.form.name = null;
    this.form.email = null;
    this.form.password = null;
    this.form.password_confirmation = null;
    this.form.role = [];

    var modal = document.getElementById('addModal');
    modal.style.display = "block";
  }

  checkboxAdd(event){
    if(event.srcElement.checked){
      this.form.role.push(event.srcElement.name);
    } else {
      var index =this.form.role.indexOf(event.srcElement.name);
      this.form.role.splice(index, index+1);
    }
    console.log(this.form.role);
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
    this.error = {
      'role' : null,
      'email' : null,
      'name' : null,
      'password' : null
    };
    var modal = document.getElementById('addModal');
    modal.style.display = "none";
  }
}
