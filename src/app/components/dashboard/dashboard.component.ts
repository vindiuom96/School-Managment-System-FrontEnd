import { Component, OnInit } from '@angular/core';
import { RolesCheckService } from 'src/app/services/roles-check.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = ['6', '7', '8', '9', '10', '11', '12'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Absent %'},
    {data: [100-65, 100-59, 100-80, 100-81, 100-56, 100-55, 100-40], label: 'Present %'}
  ];

  isAdmin = false;
  isTeacher = false;
  isStudent = false;
  isParent = false;
  isParentorStudent = false;

  constructor(private role : RolesCheckService) { }

  ngOnInit() {
    if(localStorage.getItem('token')!=null && localStorage.getItem('role')==null)
      this.wait(1100);
    this.isAdmin = this.role.isAdmin || this.role.isSuperAdmin;
    this.isTeacher = this.role.isTeacher;
    this.isStudent = this.role.isStudent;
    this.isParent = this.role.isParent;
    if(this.role.isParent||this.role.isStudent)
      this.isParentorStudent = true;
  }

  private wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
    }
  }
}
