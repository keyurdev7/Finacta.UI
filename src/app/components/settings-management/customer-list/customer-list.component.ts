import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Company } from 'src/app/models/company.model';
import { XeroCustomers } from 'src/app/models/xero-customer-list';
import { XeroMappedCompany } from 'src/app/models/xero-mapped-company.model';
import { CompanyUsersService } from 'src/app/shared/services/company-users.service';
import { SettingService } from 'src/app/shared/services/settings.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit {
  allCompanies: Company[] = [];
  public companyForm: FormGroup = new FormGroup([]);
  public mappedCompanyData: XeroMappedCompany[] = [];
  displayedColumns: string[] = [
    'contactname',
    'companyId',
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
    public dialogRef: MatDialogRef<CustomerListComponent>,
    private companyService: CompanyUsersService,
    private fb: FormBuilder,
    private settingService: SettingService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.companyForm = this.fb.group({
      clientCompany: this.fb.array([]),
    });
    this.customerDataSource.data = this.data;
    this.data.forEach((each) => {
      this.clientCompany().push(this.newClientCompany(each.companyId));
    });
    this.getCompanyDropdown();
  }

  getCompanyDropdown(): void {
    this.companyService.getAllCompanies().subscribe((res) => {
      this.allCompanies = res.data;
    });
  }

  newClientCompany(value): FormGroup {
    return this.fb.group({
      company: value,
    });
  }

  mapCompany(value: number, row): void {
    this.mappedCompanyData.push({
      xeroContactId: row.xeroContactId,
      companyId: value,
    });
  }

  clientCompany(): FormArray {
    return this.companyForm.get('clientCompany') as FormArray;
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

  saveClientMapCompany(): void {
    this.settingService
      .saveXeroContactRelation(this.mappedCompanyData)
      .subscribe((res) => {
        if (res && res.succeeded) {
          this.toastr.success(res.message);
          this.closeDialog();
        } else if (res && res.errors.length) {
          res.errors.forEach((err) => {
            this.toastr.error(err.errorMessage);
          });
        } else if (res && !res.succeeded && res.data) {
          this.toastr.error(res.data);
        }
      });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
