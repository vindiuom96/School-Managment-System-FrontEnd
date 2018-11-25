import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';

import { TokenService } from '../../services/token.service'

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit {

  permissions = null;     //Store API Data
  error = [];       //Form errors
  keyword = null;   //Current Search Keyword
  pagination = {    //Current Pagination data
    'page' :  '1',
    'max' : '10'
  }

  data = {          //Permission Update Data
    "id" : null,
    "name" : null,
  }

  form = {         //New Permission add Data
    name : null
  }

  headers = {     //Token for API Authorization
    'Authorization' : this.token.get(),
    'X-Requested-With' : 'XMLHttpRequest'
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
      this.api.get('permissions?search=' + this.keyword + '&page=' + this.pagination.page + '&sort=' + this.sortData.col + '&order=' + this.sortData.order, this.headers).subscribe(
        data => this.datahandler(data),
        error => { this.notify.clear(); this.token.remove(); this.router.navigateByUrl("/login"); }
      ); else
      this.api.get('permissions?page=' + this.pagination.page + '&sort=' + this.sortData.col + '&order=' + this.sortData.order, this.headers).subscribe(
        data => this.datahandler(data),
        error => { this.token.remove(); this.router.navigateByUrl("/login"); }
      );
  }

  datahandler(data){
    console.log(data.data);
    this.notify.clear();
    this.permissions = data.data;
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

  //Permission edit Handling
  edit(id){
    this.notify.clear();
    this.data.name = null;
    this.api.get('permissions/'+id, this.headers).subscribe(
      data => this.editDataHandler(data),
      error => this.notify.error("Permission Not Found", {timeout: 0})
    );
    this.data.id = id;
    var modal = document.getElementById('editModal');
    modal.style.display = "block";
  }

  editDataHandler(data){
    this.data.name = data.name;
  }

  editsubmit(){
    this.notify.clear();
    this.notify.info("Wait...", {timeout: 0});
    this.api.put('permissions/'+this.data.id, this.data, this.headers).subscribe(
      data => {
        this.notify.clear();
        this.notify.info("Permission Updated Successfully", {timeout: 2000});
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

  //Permission delete Handling
  delete(id){
    this.notify.clear();
    this.notify.warning('Are you sure you want to detele this Permission?', 'Delete Permission', {
      timeout: 0,
      showProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      buttons: [
        {text: 'Yes', action: () => {
          var headers = {
            'Authorization' : this.token.get()
          }
          return this.api.delete('permissions/'+id, headers).subscribe(
            data => {this.notify.info("Success", {timeout: 2000}); this.ngOnInit(); },
            error => this.notify.error(error.message, {timeout: 0})
          );
        }, bold: false},
        {text: 'No'}
      ]
    });
  }

  //New Permission add Handling
  add(){
    this.notify.clear();
    this.form.name = null;
    var modal = document.getElementById('addModal');
    modal.style.display = "block";
  }

  addModalSubmit(){
    this.notify.clear();
    this.notify.info("Wait...", {timeout: 0});
    this.api.post('permissions', this.form, this.headers).subscribe(
      data => {
        this.notify.clear();
        this.notify.info("Permission Added Successfully", {timeout: 2000});
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

