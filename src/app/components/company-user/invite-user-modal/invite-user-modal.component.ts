import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { InviteUserForm } from 'src/app/models/invite-user-form.model';
import { CompanyUsersService } from 'src/app/shared/services/company-users.service';

@Component({
  selector: 'app-invite-user-modal',
  templateUrl: './invite-user-modal.component.html',
  styleUrls: ['./invite-user-modal.component.scss'],
})
export class InviteUserModalComponent implements OnInit {
  public inviteUserForm: FormGroup = new FormGroup([]);

  constructor(
    public dialogRef: MatDialogRef<InviteUserModalComponent>,
    private fb: FormBuilder,
    private companyUserService: CompanyUsersService,
    public toster: ToastrService
  ) {}

  ngOnInit(): void {
    this.inviteUserForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      emailId: [null, [Validators.required, Validators.email]],
    });
  }

  hasError(control: string, validator: string): boolean {
    return (
      this.inviteUserForm.controls[control]?.touched &&
      this.inviteUserForm.controls[control].errors?.[validator]
    );
  }

  Invite(): void {
    const data = new InviteUserForm();
    data.firstName = this.inviteUserForm.value.firstName;
    data.lastName = this.inviteUserForm.value.lastName;
    data.emailId = this.inviteUserForm.value.emailId;

    this.companyUserService.inviteUser(data).subscribe((res) => {
      if (res && res.succeeded) {
        this.inviteUserForm.reset();
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
