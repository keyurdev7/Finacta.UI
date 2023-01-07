import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
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
    'contactName',
    'companyId',
    'contactFirstName',
    'contactLastName',
    'contactStatus',
  ];
  customerDataSource: MatTableDataSource<XeroCustomers> =
    new MatTableDataSource<XeroCustomers>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageIndex: number = 0;
  pageSize: number = 0;

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
    this.customerDataSource.data.forEach((each) => {
      this.clientCompany().push(this.newClientCompany(each.companyId));
    });
    this.pageIndex = this.customerDataSource.paginator?.pageIndex || 0;
    this.pageSize = this.customerDataSource.paginator?.pageSize || 0;

    this.getCompanyDropdown();
  }

  handlePageEvent(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
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

  mapCompany(value: number, row, index: number): void {
    const dataIndex = this.mappedCompanyData.findIndex(
      (e) => e.index === index
    );
    if (dataIndex !== -1) {
      this.mappedCompanyData.splice(dataIndex);
      if (this.customerDataSource.data[index].companyId === value) {
        return;
      }
    }
    this.mappedCompanyData.push({
      xeroContactId: row.xeroContactId,
      companyId: value,
      index: index,
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
      .saveXeroContactRelation(
        this.mappedCompanyData.map((e) => {
          delete e.index;
          return e;
        })
      )
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
