import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { SnotifyService } from 'ng-snotify';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  constructor(private api : ApiService, private notify : SnotifyService, private token : TokenService) { }

  students = null;
  headers = {     //Token for API Authorization
    'Authorization' : this.token.get(),
    'X-Requested-With' : 'XMLHttpRequest'
  }

  ngOnInit() {
    this.notify.info('Loarding...', {timeout : 0});
    this.api.get('attendance/student', this.headers).subscribe(
      data => {this.notify.clear(); this.students = data; console.log(data); },
      error => { this.notify.clear(); this.notify.error(error.error.message, {timeout : 0}); }
    )
  }

}
