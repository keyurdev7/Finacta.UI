import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from 'src/app/shared/services/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent implements OnInit {
  public forgotForm: FormGroup = new FormGroup([]);

  constructor(
    private fb: FormBuilder,
    private api: APIService,
    public toster: ToastrService,
    public router: Router
  ) {
    document.querySelector('body')?.classList.add('login-img');
  }

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  submit() {
    this.api.forgotPassword(this.forgotForm.value.email).subscribe((res) => {
      if (res && res.succeeded) {
        this.forgotForm.reset();
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

  hasError(control: string, validator: string): boolean {
    return (
      this.forgotForm.controls[control]?.touched &&
      this.forgotForm.controls[control].errors?.[validator]
    );
  }

  ngOnDestroy() {
    document.querySelector('body')?.classList.remove('login-img');
  }
}
