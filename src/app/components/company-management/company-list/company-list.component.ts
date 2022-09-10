import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Company } from 'src/app/models/company.model';
import { CompanyUsersService } from 'src/app/shared/services/company-users.service';
import { AddCompanyComponent } from '../add-company/add-company.component';
import { DeleteCompanyDialogComponent } from '../delete-company-dialog/delete-company-dialog.component';
import { CandelSubscriptionDialogComponent } from '../candel-subscription-dialog//candel-subscription-dialog.component';
import { CompanyPaymentListComponent } from '../company-payment-list/company-payment-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
})
export class CompanyListComponent implements OnInit {
  displayedColumns: string[] = [
    'companyName',
    'companyNumber',
    'SubscriptionStartDateTime',
    'SubscriptionEndDateTime',
    'subscriptionStatus',
    'action',
  ];
  companyDataSource: MatTableDataSource<Company> =
    new MatTableDataSource<Company>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private companyUserService: CompanyUsersService,
    public dialog: MatDialog,
    public toster: ToastrService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.getAllCompanies();
  }

  ngAfterViewInit() {
    this.companyDataSource.paginator = this.paginator;
    this.companyDataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.companyDataSource.filter = filterValue.trim().toLowerCase();

    if (this.companyDataSource.paginator) {
      this.companyDataSource.paginator.firstPage();
    }
  }

  getAllCompanies(): void {
    this.companyUserService.getAllCompanies().subscribe((res) => {
      this.companyDataSource.data = res.data;
    });
  }

  addCompany(): void {
    const dialog = this.dialog.open(AddCompanyComponent, {
      minWidth: '28%',
    });
    dialog.afterClosed().subscribe((result) => {
      if (result?.event === 'success') {
        this.getAllCompanies();
      }
      return;
    });
  }

  subscriptionPay(companyid: number) {
    console.log('I was closed by the timer'+ companyid);
    this.router.navigate(['/pricing/' + companyid]);
  }

  cancelSubscriptionConfirmation(id:number)
  {
    const dialog = this.dialog.open(CandelSubscriptionDialogComponent,{
      minWidth:'28%',
    });

    dialog.afterClosed().subscribe((result)=>{
      if (result?.event === 'confirm') {
        this.cancelSubscription(id);
      }
      return;
    })
  }

  cancelSubscription(id:number):void{
    this.companyUserService.cancelCompanySubscription(id).subscribe((res) => {
      if (res && res.succeeded) {
        this.toster.success(res.message);
       this.getAllCompanies();
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      } else if (res && !res.succeeded && res.data) {
        this.toster.error(res.data);
      }
    })
  }

  getCompaySubscriptionPaymentDetails(id:number):void{
    this.companyUserService.getCompanyPayments(id).subscribe((res) => {
      if (res && res.succeeded) {
        const dialog = new MatDialogConfig();
        dialog.width  = '90%';
        dialog.height= '50%';
        dialog.data = res.data;
        this.dialog.open(CompanyPaymentListComponent,dialog);
        // const dialog = this.dialog.open(CompanyPaymentListComponent,{
        //   minWidth:'28%',
        // });
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      } else if (res && !res.succeeded && res.data) {
        this.toster.error(res.data);
      }
    })
  }

  
}

