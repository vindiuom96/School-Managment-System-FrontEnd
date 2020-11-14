import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SnotifyService } from 'ng-snotify';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenService } from '../../services/token.service'
import { DataService } from 'src/app/services/data.service';
import { RolesCheckService } from 'src/app/services/roles-check.service';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css']
})
export class NoticeComponent implements OnInit {

  notices = null;

  isAdmin = false;
  isTeacher = false;
  isStudent = false;
  isParent = false;
  isStudentorParent = false;

  headers = {     //Token for API Authorization
    'Authorization' : this.token.get(),
    'X-Requested-With' : 'XMLHttpRequest'
  }

  constructor(private role : RolesCheckService, private route : ActivatedRoute, private token : TokenService, private router : Router,private api : ApiService, private notify : SnotifyService) {
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
    }
    this.api.get('notices?student_id=' + localStorage.getItem('student_id'), this.headers).subscribe(
      data => this.datahandler(data)
    );
  }

  unread = [];
  datahandler(data){
    this.notify.clear();
    console.log(data);
    this.notices = data;

    for(var i=0; i<data.length; i++){
      if(data[i].status=='false'){
        this.unread.push(data[i]);
        this.api.get('notices/read?notice_id=' + data[i].id, this.headers).subscribe(
        );
      }
    }

    console.log(this.unread);
  }


  //User edit Handling
  edit(id){
    this.notify.clear();
    this.data = null;
    // this.api.get('users/'+id, this.headers).subscribe(
    //   data => this.editDataHandler(data),
    //   error => this.notify.error("User Not Found", {timeout: 0})
    // );
    //this.data.id = id;
    var modal = document.getElementById('editModal');
    modal.style.display = "block";
  }

  editDataHandler(data){
    console.log(data);
    // this.data.name = data.name;
    // for(var i=0; i<data.roles.length; i++)
    //   this.data.role.push(data.roles[i].name);
  }

  editsubmit(){
    this.notify.clear();
    this.notify.info("Wait...", {timeout: 0});
    // this.api.put('users/'+this.data.id, this.data, this.headers).subscribe(
    //   data => {
    //     this.notify.clear();
    //     this.notify.info("User Updated Successfully", {timeout: 2000});
    //     this.ngOnInit();
    //     this.closeEditModal();
    //   },
    //   error => { this.notify.clear(); this.error = error.error.errors; }
    // );
  }

  closeEditModal(){
    this.error = {
      "title" : null,
      "content" : null,
      "isRoleBased" : null,
      "to" : null
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
          // return this.api.delete('users/'+id, headers).subscribe(
          //   data => {this.notify.info("Success", {timeout: 2000}); this.ngOnInit(); },
          //   error => this.notify.error(error.message, {timeout: 0})
          // );
        }, bold: false},
        {text: 'No'}
      ]
    });
  }

  //New User add Handling
  add(){
    this.notify.clear();

    this.form.content = null;
    this.form.isRoleBased = false;
    this.form.title = null;
    this.form.to = null;

    var modal = document.getElementById('addModal');
    modal.style.display = "block";
  }

  addModalSubmit(){
    this.notify.clear();
    this.notify.info("Wait...", {timeout: 0});
    this.api.post('notices', this.data, this.headers).subscribe(
      data => {
        this.notify.clear();
        this.notify.info("Notice Sent Successfully", {timeout: 2000});
        this.closeAddModal();
      },
      error => { this.notify.clear(); this.error = error.error.errors; }
    );

  }

  data = {          //User Update Data
    "title" : null,
    "content" : null,
    "isRoleBased" : true,
    "to" : null
  }

  form = {         //New User add Data
    "title" : null,
    "content" : null,
    "isRoleBased" : true,
    "to" : null
  }

  error = {
    "title" : null,
    "content" : null,
    "isRoleBased" : null,
    "to" : null
  };
  closeAddModal(){
    this.error = {
      "title" : null,
      "content" : null,
      "isRoleBased" : null,
      "to" : null
    };
    var modal = document.getElementById('addModal');
    modal.style.display = "none";
  }

}


