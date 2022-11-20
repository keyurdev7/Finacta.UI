import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { AddCompanyForm } from 'src/app/models/add-company-form.model';
import { User } from 'src/app/models/user.model';
import { APIService } from 'src/app/shared/services/api.service';
import { CompanyUsersService } from 'src/app/shared/services/company-users.service';
import { AppState, userSelector } from 'src/app/store/app.state';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss'],
})
export class AddCompanyComponent implements OnInit {
  user: User = new User();
  subscriptions: Subscription[] = [];
  public companies: any[] = [];
  public showCompanyLoader: boolean = false;
  public showNoResult: boolean = false;
  public addCompanyForm: FormGroup = new FormGroup([]);

  constructor(
    public dialogRef: MatDialogRef<AddCompanyComponent>,
    private fb: FormBuilder,
    public store: Store<AppState>,
    private companyUserService: CompanyUsersService,
    private api: APIService,
    public toster: ToastrService
  ) {}

  ngOnInit(): void {
    this.subscribeToUser();
    this.addCompanyForm = this.fb.group({
      name: [null, [Validators.required]],
      phoneNumber: [
        null,
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
    });
    this.subscriptions.push(
      this.addCompanyForm.controls['name'].valueChanges
        .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe((v) => this.search(v))
    );
  }

  search(val: string = '') {
    this.showNoResult = false;
    if (!!val) {
      this.showCompanyLoader = true;
      this.api.syncCompaniesHouse(val).subscribe((res) => {
        this.companies = res.data;
        this.showCompanyLoader = false;
        if (!this.companies.length) this.showNoResult = true;
      });
    } else {
      this.companies = [];
    }
  }

  addNumber(value): void {
    this.addCompanyForm.patchValue({
      phoneNumber: this.companies.length
        ? this.companies.find((each) => each.companyName === value)
            .companyNumber
        : '',
    });
  }

  subscribeToUser() {
    this.subscriptions.push(
      this.store.pipe(userSelector).subscribe((res) => {
        this.user = res;
      })
    );
  }

  hasError(control: string, validator: string): boolean {
    return (
      this.addCompanyForm.controls[control]?.touched &&
      this.addCompanyForm.controls[control].errors?.[validator]
    );
  }

  Add(): void {
    const data = new AddCompanyForm();
    data.companyName = this.addCompanyForm.value.name;
    data.companyNumber = this.addCompanyForm.value.phoneNumber;
    data.userId = this.addCompanyForm.value.emailId;

    this.companyUserService.addCompany(data).subscribe((res) => {
      if (res && res.succeeded) {
        this.addCompanyForm.reset();
        this.dialogRef.close({ event: 'success', data: parseInt(res.data) });
        this.toster.success(res.message);
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      } else if (res && !res.succeeded && res.data) {
        this.toster.error(res.data);
      }
    });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
