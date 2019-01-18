import { Component, OnInit } from '@angular/core';
import { RolesCheckService } from 'src/app/services/roles-check.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isAdmin = false;
  isTeacher = false;
  isStudent = false;
  isParent = false;

  constructor(private role : RolesCheckService) { }

  ngOnInit() {
    if(localStorage.getItem('token')!=null && localStorage.getItem('role')==null)
      this.wait(1100);
    this.isAdmin = this.role.isAdmin;
    this.isTeacher = this.role.isTeacher;
    this.isStudent = this.role.isStudent;
    this.isParent = this.role.isParent;
  }

  private wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
    }
  }
}
