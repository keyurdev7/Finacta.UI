import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AddCompanyForm } from 'src/app/models/add-company-form.model';
import { User } from 'src/app/models/user.model';
import { CompanyUsersService } from 'src/app/shared/services/company-users.service';
import { AppState, userSelector } from 'src/app/store/app.state';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent implements OnInit {
  user: User = new User();
  subscriptions: Subscription[] = [];
  public addCompanyForm: FormGroup = new FormGroup([]);

  constructor(
    public dialogRef: MatDialogRef<AddCompanyComponent>,
    private fb: FormBuilder,
    public store: Store<AppState>,
    private companyUserService: CompanyUsersService,
    public toster: ToastrService
  ) {}

  ngOnInit(): void {
    this.subscribeToUser();
    this.addCompanyForm = this.fb.group({
      name: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]]
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
        this.dialogRef.close({ event: 'success' });
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
