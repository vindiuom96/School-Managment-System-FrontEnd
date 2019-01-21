import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})
export class ClassComponent implements OnInit {
  model: any = {};
  classes = null;

  constructor(private api : ApiService) { }

  ngOnInit() {
    this.api.get('classes', null).subscribe(
      data => {console.log(data)}
    )
  }
  onSubmit() {
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.model))
    this.api.post('classes', this.model, null).subscribe(
      data => {console.log(data)}
    )
  }

}
