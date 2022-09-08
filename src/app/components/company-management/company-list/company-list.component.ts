import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Company } from 'src/app/models/company.model';
import { CompanyUsersService } from 'src/app/shared/services/company-users.service';
import { AddCompanyComponent } from '../add-company/add-company.component';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
})
export class CompanyListComponent implements OnInit {
  displayedColumns: string[] = [
    'companyName',
    'companyNumber',
    'subscriptionEndDate',
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
    public toster: ToastrService
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
}
