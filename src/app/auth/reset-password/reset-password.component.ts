import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/shared/services/api.service';
import { CustomValidators } from 'src/app/shared/validations/CustomValidators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  public isVerified: boolean = false;
  private userId: string = '';
  public resetForm: FormGroup = new FormGroup([]);

  constructor(
    private fb: FormBuilder,
    private api: APIService,
    private activatedRoute: ActivatedRoute,
    public toster: ToastrService,
    public router: Router
  ) {
    document.querySelector('body')?.classList.add('login-img');

    this.activatedRoute.queryParams.subscribe((params) => {
      const token = params['param'];
      this.api.verifyForgotPasswordLink(token).subscribe((res) => {
        if (res && res.succeeded) {
          this.isVerified = true;
          this.userId = res.data;
        } else if (res && res.errors.length) {
          this.isVerified = false;
          this.userId = '';
          res.errors.forEach((err) => {
            this.toster.error(err.errorMessage);
            this.router.navigate(['/auth/login']);
          });
        }
      });
    });
  }

  ngOnInit(): void {
    this.resetForm = this.fb.group(
      {
        tempPassword: [null, [Validators.required]],
        password: [null, [Validators.required, Validators.minLength(8)]],
        confirmPass: [null, [Validators.required]],
      },
      {
        validators: [CustomValidators.mustMatch('password', 'confirmPass')],
      }
    );
  }

  hasError(control: string, validator: string): boolean {
    return (
      this.resetForm.controls[control]?.touched &&
      this.resetForm.controls[control].errors?.[validator]
    );
  }

  submit(): void {
    this.api
      .resetPassword(
        this.userId,
        this.resetForm.value.password,
        this.resetForm.value.tempPassword
      )
      .subscribe((res) => {
        if (res && res.succeeded) {
          this.resetForm.reset();
          this.toster.success(res.message).onHidden.subscribe((hide) => {
            this.router.navigate(['/auth/login']);
          });
        } else if (res && res.errors.length) {
          res.errors.forEach((err) => {
            this.toster.error(err.errorMessage);
          });
        }
      });
  }

  ngOnDestroy() {
    document.querySelector('body')?.classList.remove('login-img');
  }
}
