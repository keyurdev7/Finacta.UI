import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { XeroCustomers } from 'src/app/models/xero-customer-list';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  displayedColumns: string[] = [
    'contactname',
    'contactfirstname',
    'contactlastname',
    'contactstatus',
  ];

  customerDataSource: MatTableDataSource<XeroCustomers> =
    new MatTableDataSource<XeroCustomers>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CustomerListComponent>
  ) { 

    this.customerDataSource.data = data;
  }

  ngOnInit(): void {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.customerDataSource.filter = filterValue.trim().toLowerCase();

    if (this.customerDataSource.paginator) {
      this.customerDataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.customerDataSource.paginator = this.paginator;
    this.customerDataSource.sort = this.sort;
  }
  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
