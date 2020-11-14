import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { TokenService } from 'src/app/services/token.service';
import { RolesCheckService } from 'src/app/services/roles-check.service';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})
export class ClassComponent implements OnInit {
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

  ngOnInit() {
    this.notify.clear();
    this.notify.info("Loading...", {timeout: 2000});
    this.isAdmin = this.role.isAdmin || this.role.isSuperAdmin;
    this.isTeacher = this.role.isTeacher;
    this.isStudent = this.role.isStudent;
    this.isParent = this.role.isParent;
    if(this.isAdmin){
      this.api.get('class', this.headers).subscribe(
        data => {console.log(data), this.classes = data; this.dataHandler(data)}
      )
      this.api.get('class/teacherall', this.headers).subscribe(
        data => this.teachers = data,
        error => { this.notify.error(error.error.message) }
      );
    }
    else
      this.api.get('class/teacher', this.headers).subscribe(
        data => {console.log(data), this.classes = data; }
      )

  }
teachers = null;
  //User edit Handling
  edit(id){
    this.notify.clear();
    this.api.get('class/'+id, this.headers).subscribe(
      data => this.editDataHandler(data),
      error => this.notify.error("User Not Found", {timeout: 0})
    );
    this.data.id = id;
    var modal = document.getElementById('editModal');
    modal.style.display = "block";
  }

  editDataHandler(data){
    console.log(data);
    this.data.sub_class = data.sub_class;
    this.data.teacher_id = data.teacher_id;
    this.data.grade = data.grade;
    // for(var i=0; i<data.roles.length; i++)
    //   this.data.role.push(data.roles[i].name);
  }

  editsubmit(){
    this.notify.clear();
    this.notify.info("Wait...", {timeout: 0});
    this.api.put('class/'+this.data.id, this.data, this.headers).subscribe(
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
      "grade" : null,
      "sub_class" : null,
      "teacher_id" : null
    };
    var modal = document.getElementById('editModal');
    modal.style.display = "none";
  }

  //User delete Handling
  delete(id){
    this.notify.clear();
    this.notify.warning('Are you sure you want to detele?', 'Delete', {
      timeout: 0,
      showProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      buttons: [
        {text: 'Yes', action: () => {
          var headers = {
            'Authorization' : this.token.get()
          }
          return this.api.delete('class/'+id, headers).subscribe(
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

    this.data.grade = null;
    this.data.sub_class = null;
    this.data.teacher_id = null;
    this.data.id = null;

    var modal = document.getElementById('addModal');
    modal.style.display = "block";
  }

  addModalSubmit(){
    this.notify.clear();
    this.notify.info("Wait...", {timeout: 0});
    this.api.post('class', this.data, this.headers).subscribe(
      data => {
        this.notify.clear();
        this.notify.info("User Added Successfully", {timeout: 2000});
        this.ngOnInit();
        this.closeAddModal();
      },
      error => { this.notify.clear(); this.error = error.error.errors; }
    );

  }

  dataHandler(data){
    this.teachers = [
      {'id' : 1,
      'name' : 'Saranga'
    }
    ];
  }

  data = {          //User Update Data
    "grade" : null,
    "sub_class" : null,
    "teacher_id" : 1,
    "id" : null
  }

  form = {         //New User add Data
    "grade" : null,
    "sub_class" : null,
    "teacher_id" : null,
    "id" : null
  }

  error = {
    "grade" : null,
    "sub_class" : null,
    "teacher_id" : null
  };
  closeAddModal(){
    this.error = {
      "grade" : null,
      "sub_class" : null,
      "teacher_id" : null
    };
    var modal = document.getElementById('addModal');
    modal.style.display = "none";
  }

}
