import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from 'src/app/shared/services/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public show: boolean = false;
  public loginForm: FormGroup | any;
  public errorMessage: any;

  constructor(
    private fb: FormBuilder,
    private api: APIService,
    public toster: ToastrService,
    public cookieService: CookieService,
    public router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
    });
    document.querySelector('body')?.classList.add('login-img');
  }

  ngOnInit() {}

  // Simple Login
  login() {
    this.api
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe((res) => {
        if (res && res.succeeded) {
          this.loginForm.reset();
          this.cookieService.set('user', JSON.stringify(res.data), 1, '/');
          if (!!res.data.isPortalSubscibe) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/pages/pricing']);
          }
        } else if (res && res.errors.length) {
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
