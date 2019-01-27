import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service'
import { DataService } from 'src/app/services/data.service';
import { RolesCheckService } from 'src/app/services/roles-check.service';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit {

  subjects = null;

  isAdmin = false;
  isTeacher = false;
  isStudent = false;
  isParent = false;
  isStudentorParent = false;

  headers = {     //Token for API Authorization
    'Authorization' : this.token.get(),
    'X-Requested-With' : 'XMLHttpRequest'
  }

  constructor(private role : RolesCheckService,private data: DataService , private token : TokenService, private router : Router,private api : ApiService, private notify : SnotifyService) {
  }

  ngOnInit() {
    this.notify.clear();
    this.notify.info("Loading...", {timeout: 0});
    this.isAdmin = this.role.isAdmin || this.role.isSuperAdmin;
    this.isTeacher = this.role.isTeacher;
    this.isStudent = this.role.isStudent;
    this.isParent = this.role.isParent;
    if(this.isParent || this.isStudent){
      this.isStudentorParent = true;
      this.api.get('subjects?student_id=' + localStorage.getItem('student_id'), this.headers).subscribe(
        data => this.datahandler(data),
        error => { this.token.remove(); this.router.navigateByUrl("/login"); }
      );
    } else {
      this.notify.clear();
    }
  }

  datahandler(data){
    this.notify.clear();
    console.log(data);
    this.subjects = data;
  }

}
