import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserRole } from 'src/app/models/user-role.model';
import { CompanyUsersService } from 'src/app/shared/services/company-users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompanyUser } from 'src/app/models/company-user.model';
import { ToastrService } from 'ngx-toastr';
import { O } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-edit-role-modal',
  templateUrl: './edit-role-modal.component.html',
  styleUrls: ['./edit-role-modal.component.scss'],
})
export class EditRoleModalComponent implements OnInit {
  public userRoles: UserRole[] = [];
  public roleForm: FormGroup = new FormGroup([]);
  constructor(
    @Inject(MAT_DIALOG_DATA) public userData: CompanyUser,
    public dialogRef: MatDialogRef<EditRoleModalComponent>,
    private companyUserService: CompanyUsersService,
    private fb: FormBuilder,
    public toster: ToastrService
  ) {}

  ngOnInit(): void {
    this.getUserRoles();
    this.formInit();
  }

  getUserRoles(): void {
    this.companyUserService.getUserRole().subscribe((res) => {
      this.userRoles = res.data;
      if (this.userData) {
        this.roleForm.patchValue({
          roleId: parseInt(this.userData.userRoleId),
        });
      }
    });
  }

  formInit(): void {
    this.roleForm = this.fb.group({
      roleId: [null, [Validators.required]],
    });
  }

  updateRole(): void {
    this.companyUserService
      .changeUserRole(this.roleForm.value.roleId, this.userData.userCompanyId)
      .subscribe((res) => {
        if (res && res.succeeded) {
          this.roleForm.reset();
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

  hasError(control: string, validator: string): boolean {
    return (
      this.roleForm.controls[control]?.touched &&
      this.roleForm.controls[control].errors?.[validator]
    );
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
