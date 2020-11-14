import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';

import { TokenService } from '../../services/token.service'
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  locations = null;
  error = [];       //Form errors
  keyword = null;   //Current Search Keyword
  pagination = {    //Current Pagination data
    'page' :  '1',
    'max' : '10'
  }
  headers = {     //Token for API Authorization
    'Authorization' : this.token.get(),
    'X-Requested-With' : 'XMLHttpRequest'
  }
  sortData = {        //Current Sort Data
    "col" : null,
    "order" : null
  }

  constructor(private data: DataService , private pg: NgbPaginationConfig, private token : TokenService, private http : HttpClient, private router : Router,private api : ApiService, private notify : SnotifyService) {
    pg.boundaryLinks = true;
    pg.rotate = true;
  }

  ngOnInit() {
    this.notify.clear();
    this.notify.info("Loading...", {timeout: 0});
    if(this.keyword) {
      this.api.get('locations?search=' + this.keyword + '&page=' + this.pagination.page + '&sort=' + this.sortData.col + '&order=' + this.sortData.order, this.headers).subscribe(
        data => this.datahandler(data),
        error => { this.notify.clear(); this.notify.error(error.error.message) }
      );
    } else {
      this.api.get('locations?page=' + this.pagination.page + '&sort=' + this.sortData.col + '&order=' + this.sortData.order, this.headers).subscribe(
        data => this.datahandler(data),
        error => { this.notify.error(error.error.message) }
      );
    }
  }

  datahandler(data){
    console.log(data.data);
    this.notify.clear();
    this.locations = data.data;
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

  locationMap(id){
    this.data.changeMessage(id);
    this.router.navigateByUrl("/locationMap");
  }

}
