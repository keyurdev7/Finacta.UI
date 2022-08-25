import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ApexRandomData } from 'src/app/shared/data/dashboard/dashboardData';

export interface DashboardTableDataType {
  id: number;
  AssignTo?: string;
  img?: string;
  mail?: string;
  task?: string;
  project?: string;
  dueDate?: string;
  dueDateStatus?: string;
  status?: string;
}

const DashboardTable_Data: DashboardTableDataType[] = [
  {id:1, AssignTo:'Skyler Hilda', img:'./assets//images/users/11.jpg', mail:'member@spruko.com', task:'Sit sed takimata sanctus invidunt', project:'Noa Dashboard UI', dueDate:'31 Oct 21', dueDateStatus:'danger', status:''},
  {id:2, AssignTo:'Daniel Obrien', img:'./assets//images/users/12.jpg', mail:'member@spruko.com', task:'Diam lorem dolor no lorem.', project:'Noa Dashboard UI', dueDate:'01 Nov 21', dueDateStatus:'danger', status:''},
  {id:3, AssignTo:'William Turner', img:'./assets//images/users/13.jpg', mail:'member@spruko.com', task:'Amet clita sea ut dolor consetetur, elitr.', project:'Noa Dashboard UI', dueDate:'08 Nov 21', dueDateStatus:'danger', status:''},
  {id:4, AssignTo:'Olena Tyrell', img:'./assets//images/users/14.jpg', mail:'member@spruko.com', task:'Est sea erat at kasd.', project:'Noa Dashboard UI', dueDate:'04 Nov 21', dueDateStatus:'danger', status:''},
  {id:5, AssignTo:'Emilie Benett', img:'./assets//images/users/5.jpg', mail:'member@spruko.com', task:'Rebum gubergren at kasd takimata clita.', project:'Noa Dashboard UI', dueDate:'29 Oct 21', dueDateStatus:'danger', status:''},
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['AssignTo', 'Task', 'Projects', 'Duedate', 'Status', 'Action'];
  // Assign the data to the data source for the table to render
  dataSource = new MatTableDataSource(DashboardTable_Data);

  constructor() {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  ngOnInit(): void {
  }

  public RandomData = ApexRandomData;
}

