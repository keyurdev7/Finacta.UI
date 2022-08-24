import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/shared/services/api.service';
import { CustomValidators } from 'src/app/shared/validations/CustomValidators';

@Component({
  selector: 'app-resister',
  templateUrl: './resister.component.html',
  styleUrls: ['./resister.component.scss'],
})
export class ResisterComponent implements OnInit {
  public registerForm: FormGroup;
  public showLoader: boolean;

  constructor(
    private fb: FormBuilder,
    private api: APIService,
    public toster: ToastrService,
    public router: Router
  ) {
    this.showLoader = false;
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        emailId: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPass: ['', [Validators.required]],
        companyName: ['', [Validators.required]],
        companyNumber: ['', [Validators.required]],
      }
      // CustomValidators.mustMatch('password', 'confirmPass')
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
    this.showLoader = true;
    const data = { ...this.registerForm.value };
    delete data.confirmPass;
    this.api.register(data).subscribe(
      (res) => {
        this.showLoader = false;
        if (res && res.succeeded) {
          this.toster.success(res.message).onHidden.subscribe((hide) => {
            this.registerForm.reset();
            this.router.navigate(['/auth/login']);
          });
        } else if (res && res.errors.length) {
          res.errors.forEach((err) => {
            this.toster.error(err.errorMessage);
          });
        }
      }
    );
  }

  ngOnDestroy() {
    document.querySelector('body')?.classList.remove('login-img');
  }
}
