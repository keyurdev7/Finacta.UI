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
  public selectedRole: number = O;
  constructor(
    @Inject(MAT_DIALOG_DATA) public userData: CompanyUser,
    public dialogRef: MatDialogRef<EditRoleModalComponent>,
    private companyUserService: CompanyUsersService,
    private fb: FormBuilder,
    public toster: ToastrService
  ) {}

  ngOnInit(): void {
    this.getUserRoles();
    this.roleForm = this.fb.group({
      roleId: [
        !!this.userData ? this.userData.userRoleId : null,
        [Validators.required],
      ],
    });
  }

  getUserRoles(): void {
    this.companyUserService.getUserRole().subscribe((res) => {
      this.userRoles = res.data;
      if (this.userData) {
        this.selectedRole = this.userData.userRoleId;
      }
    });
  }

  updateRole(): void {
    this.companyUserService
      .changeUserRole(this.userData.userId, this.roleForm.value.roleId)
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
