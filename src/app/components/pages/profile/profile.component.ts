import { Component, OnInit } from '@angular/core';
import { Gallery } from 'angular-gallery';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/shared/services/api.service';
import { CustomValidators } from 'src/app/shared/validations/CustomValidators';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public changePasswordForm: FormGroup = new FormGroup([]);
  constructor(
    private gallery: Gallery,
    private fb: FormBuilder,
    private api: APIService,
    public toster: ToastrService,
    public router: Router,
    public cookieService: CookieService
  ) {}

  images: any[] = [
    { path: './assets/images/media/1.jpg' },
    { path: './assets/images/media/4.jpg' },
    { path: './assets/images/media/5.jpg' },
    { path: './assets/images/media/6.jpg' },
    { path: './assets/images/media/7.jpg' },
    { path: './assets/images/media/8.jpg' },
    { path: './assets/images/media/11.jpg' },
    { path: './assets/images/media/10.jpg' },
    { path: './assets/images/media/2.jpg' },
    { path: './assets/images/media/9.jpg' },
    { path: './assets/images/media/12.jpg' },
    { path: './assets/images/media/20.jpg' },
  ];
  showGallery(index: number) {
    let prop: any = {};
    prop.images = this.images;
    prop.index = index;
    this.gallery.load(prop);
  }
  ngOnInit(): void {
    this.changePasswordForm = this.fb.group(
      {
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
      this.changePasswordForm.controls[control]?.touched &&
      this.changePasswordForm.controls[control].errors?.[validator]
    );
  }

  changePassword(): void {
    const user = JSON.parse(this.cookieService.get('user'));
    this.api
      .changePassword(user.userId, this.changePasswordForm.value.password)
      .subscribe((res) => {
        if (res && res.succeeded) {
          this.changePasswordForm.reset();
          this.toster.success(res.message);
        } else if (res && res.errors.length) {
          res.errors.forEach((err) => {
            this.toster.error(err.errorMessage);
          });
        }
      });
  }
  
  closeGallery() {
    this.gallery.close();
  }
}
