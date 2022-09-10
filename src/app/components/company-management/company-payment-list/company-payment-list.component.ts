import { Component, Inject, inject, OnInit,ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentHistory } from 'src/app/models/company.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-company-payment-list',
  templateUrl: './company-payment-list.component.html',
  styleUrls: ['./company-payment-list.component.scss']
})
export class CompanyPaymentListComponent implements OnInit {

  displayedColumns: string[] = [
    'amount',
    'subscriptionEndDateTime',
    'subscriptionStartDateTime',
    'finactaUniqueId',
    'stripeSessionId',
    'paymentErrorText'
  ];

  paymentDataSource: MatTableDataSource<PaymentHistory> =new MatTableDataSource<PaymentHistory>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  fromparentcomponent : string;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public dialogRef: MatDialogRef<CompanyPaymentListComponent> ) {
      this.fromparentcomponent = data;
      this.paymentDataSource.data = data;
   }

  ngOnInit(): void {
    console.log(this.paymentDataSource.data);
  }

  ngAfterViewInit() {
    this.paymentDataSource.paginator = this.paginator;
    this.paymentDataSource.sort = this.sort;
  }
  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
