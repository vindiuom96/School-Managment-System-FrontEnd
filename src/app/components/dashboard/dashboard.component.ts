import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(private token : TokenService, private http : HttpClient, private router : Router,private api : ApiService, private notify : SnotifyService) { }

  ngOnInit() {
    var headers = {
      'Authorization' : this.token.get()
    }
    return this.api.get('auth/user', headers).subscribe(
      data => console.log(data),
      error => console.log(error)
    );
  }

  pause(id){
  }

  noticebyid(data){
  }

  edit(id){
    var modal = document.getElementById('modal');
    modal.style.display = "block";
  }

  editsub(){
    this.close();
    //console.log(this.formid.id);
  }

  close(){
    var modal = document.getElementById('modal');
    modal.style.display = "none";
  }

  closeadd(){
    var modal = document.getElementById('modaladd');
    modal.style.display = "none";
  }

  delete(id){
    this.notify.confirm('Are you sure you want to detele this Notice?', 'Delete Notice', {
      timeout: 0,
      showProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      buttons: [
        {text: 'Yes', action: () => {
          //code
        }, bold: false},
        {text: 'No'}
      ]
    });
    //setTimeout(2000);
    this.ngOnInit();
  }

  add(){
    var modal = document.getElementById('modaladd');
    modal.style.display = "block";
  }

  addnot(){
    this.closeadd();
    //console.log(this.formid.id);
  }
}
