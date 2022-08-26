import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegisterForm } from 'src/app/models/register-form.model';
import { APIService } from 'src/app/shared/services/api.service';
import { CustomValidators } from 'src/app/shared/validations/CustomValidators';

@Component({
  selector: 'app-resister',
  templateUrl: './resister.component.html',
  styleUrls: ['./resister.component.scss'],
})
export class ResisterComponent implements OnInit {
  public registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: APIService,
    public toster: ToastrService,
    public router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: [null, [Validators.required]],
        lastName: [null, [Validators.required]],
        emailId: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(8)]],
        confirmPass: [null, [Validators.required]],
        companyName: [null, [Validators.required]],
        companyNumber: [null, [Validators.required]],
      },
      {
        validators: [CustomValidators.mustMatch('password', 'confirmPass')],
      }
    );

    document.querySelector('body')?.classList.add('login-img');
  }

  ngOnInit(): void {}

  hasError(control: string, validator: string): boolean {
    return (
      this.registerForm.controls[control]?.touched &&
      this.registerForm.controls[control].errors?.[validator]
    );
  }

  submit(): void {
    const data = new RegisterForm();
    data.firstName = this.registerForm.value.firstName;
    data.lastName = this.registerForm.value.lastName;
    data.emailId = this.registerForm.value.emailId;
    data.password = this.registerForm.value.password;
    data.companyName = this.registerForm.value.companyName;
    data.companyNumber = this.registerForm.value.companyNumber;

    this.api.register(data).subscribe((res) => {
      if (res && res.succeeded) {
        this.registerForm.reset();
        this.router.navigate(['/auth/register-success']);
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
