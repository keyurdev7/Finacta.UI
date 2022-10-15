import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from 'src/app/shared/services/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import {
  SetStripeKeyAction,
  UpdateUserAction,
} from 'src/app/store/app.actions';
import { StripeKey } from 'src/app/models/stripe-key.model';
import { AppState, stripeKeySelector } from 'src/app/store/app.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public show: boolean = false;
  public loginForm: FormGroup = new FormGroup([]);
  public errorMessage: any;
  isStripeKeySet: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: APIService,
    public toster: ToastrService,
    public router: Router,
    public store: Store<AppState>
  ) {
    document.querySelector('body')?.classList.add('login-img');
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
    });
    this.store.pipe(stripeKeySelector).subscribe((res) => {
      this.isStripeKeySet = !!res.key;
    });
  }

  login() {
    this.api
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe((res) => {
        if (res && res.succeeded) {
          this.loginForm.reset();
          if (!!res.data.isTemporaryPassword) {
            this.router.navigate(['/auth/setpassword/' + res.data.userId]);
          } else {
            this.store.dispatch(UpdateUserAction(res.data));
            if (!this.isStripeKeySet) {
              this.api.getStripeKey().subscribe((res2) => {
                if (res2 && res2.succeeded) {
                  const stripeKey = new StripeKey();
                  stripeKey.key = res2.data;
                  this.store.dispatch(SetStripeKeyAction(stripeKey));
                }
              });
            }
            if (!!res.data.isPortalSubscibe) {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/pricing']);
            }
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
