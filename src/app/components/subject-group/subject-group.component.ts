import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { TokenService } from 'src/app/services/token.service';
import { RolesCheckService } from 'src/app/services/roles-check.service';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-subject-group',
  templateUrl: './subject-group.component.html',
  styleUrls: ['./subject-group.component.css']
})
export class SubjectGroupComponent implements OnInit {

  model: any = {};
  classes = null;

  constructor(private notify : SnotifyService, private api : ApiService, private token : TokenService, private role : RolesCheckService) { }

  headers = {     //Token for API Authorization
    'Authorization' : this.token.get(),
    'X-Requested-With' : 'XMLHttpRequest'
  }

  isAdmin = null;
  isTeacher = null;
  isStudent = null;
  isParent = null;
 subjects = null;

  ngOnInit() {
    this.notify.clear();
    this.notify.info("Loading...", {timeout: 2000});
    this.isAdmin = this.role.isAdmin || this.role.isSuperAdmin;
    this.isTeacher = this.role.isTeacher;
    this.isStudent = this.role.isStudent;
    this.isParent = this.role.isParent;
    if(this.isAdmin){
      this.api.get('class', this.headers).subscribe(
        data => {console.log(data), this.classes = data; }
      )
      this.api.get('subjects', this.headers).subscribe(
        data => this.subjects = data,
        error => { this.notify.error(error.error.message) }
      );
    }
    else
      this.api.get('class/teacher', this.headers).subscribe(
        data => {console.log(data), this.classes = data; }
      )
  }

  //User edit Handling
  edit(id){
    this.notify.clear();
    this.api.get('subjects/'+id, this.headers).subscribe(
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
    this.data.year = data.year;
    // for(var i=0; i<data.roles.length; i++)
    //   this.data.role.push(data.roles[i].name);
  }

  editsubmit(){
    this.notify.clear();
    this.notify.info("Wait...", {timeout: 0});
    this.api.put('subjects/'+this.data.id, this.data, this.headers).subscribe(
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
      "year" : null,
      "name" : null,
      "id" : null
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
          return this.api.delete('subjects/'+id, headers).subscribe(
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

    this.data.year = null;
    this.data.name = null;
    this.data.id = null;

    var modal = document.getElementById('addModal');
    modal.style.display = "block";
  }

  addModalSubmit(){
    this.notify.clear();
    this.notify.info("Wait...", {timeout: 0});
    this.api.post('subjects', this.data, this.headers).subscribe(
      data => {
        this.notify.clear();
        this.notify.info("User Added Successfully", {timeout: 2000});
        this.ngOnInit();
        this.closeAddModal();
      },
      error => { this.notify.clear(); this.error = error.error.errors; }
    );

  }

  data = {          //User Update Data
    "year" : null,
    "name" : null,
    "id" : null
  }

  form = {         //New User add Data
    "year" : null,
    "name" : null,
    "id" : null
  }

  error = {
    "year" : null,
    "name" : null,
    "id" : null
  };
  closeAddModal(){
    this.error = {
      "year" : null,
      "name" : null,
      "id" : null
    };
    var modal = document.getElementById('addModal');
    modal.style.display = "none";
  }

}

