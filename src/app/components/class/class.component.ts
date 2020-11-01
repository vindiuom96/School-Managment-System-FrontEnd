import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})
export class ClassComponent implements OnInit {
  model: any = {};
  classes = null;

  constructor(private api : ApiService, private token : TokenService) { }

  headers = {     //Token for API Authorization
    'Authorization' : this.token.get(),
    'X-Requested-With' : 'XMLHttpRequest'
  }

  ngOnInit() {
    this.api.get('class/teacher', this.headers).subscribe(
      data => {console.log(data), this.classes = data; }
    )
  }

}
