import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from 'src/app/shared/services/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public show: boolean = false;
  public loginForm: FormGroup | any;
  public errorMessage: any;
  public showLoader: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: APIService,
    public toster: ToastrService,
    public router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
    document.querySelector('body')?.classList.add('login-img');
  }

  ngOnInit() {}

  // Simple Login
  login() {
    this.showLoader = true;
    this.api
      .login(this.loginForm.email.value, this.loginForm.password.value)
      .subscribe((res) => {
        if (res && res.succeeded) {
          this.toster.success(res.message).onHidden.subscribe((hide) => {
            this.loginForm.reset();
            this.showLoader = false;
            this.router.navigate(['/auth/login']);
          });
        } else if (res && res.errors.length) {
          this.showLoader = false;
          res.errors.forEach((err) => {
            this.toster.error(err.errorMessage);
          });
        }
      });
  }

  hasError(control: string, validator: string): boolean {
    return (
      this.loginForm.controls[control]?.touched &&
      this.loginForm.controls[control].errors?.[validator]
    );
  }

  ngOnDestroy() {
    document.querySelector('body')?.classList.remove('login-img');
  }
}
