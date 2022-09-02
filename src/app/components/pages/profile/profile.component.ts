import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ProfileForm } from 'src/app/models/profile-form.model';
import { User } from 'src/app/models/user.model';
import { APIService } from 'src/app/shared/services/api.service';
import { CustomValidators } from 'src/app/shared/validations/CustomValidators';
import { UpdateUserAction } from 'src/app/store/app.actions';
import { AppState, userSelector } from 'src/app/store/app.state';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public profileForm: FormGroup = new FormGroup([]);
  public changePasswordForm: FormGroup = new FormGroup([]);
  public user: User = new User();
  private file: File | null = null;
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private api: APIService,
    public toster: ToastrService,
    public router: Router,
    public store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.subscribeToUser();
    this.profileForm = this.fb.group({
      firstName: [this.user.firstName, [Validators.required]],
      lastName: [this.user.lastName, [Validators.required]],
      image: [null, []],
      phone: [this.user.phoneNumber, []],
      position: [this.user.position, []],
      marketing: [this.user.marketingEmails, []],
    });
    this.changePasswordForm = this.fb.group(
      {
        password: [null, [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)?(?=.*[-+_!@#$%^&*.,?])?.+$/gm)]],
        confirmPass: [null, [Validators.required]],
      },
      {
        validators: [CustomValidators.mustMatch('password', 'confirmPass')],
      }
    );
  }

  subscribeToUser() {
    this.subscriptions.push(
      this.store.pipe(userSelector).subscribe((res) => {
        this.user = res;
      })
    );
  }

  getFullName(): string {
    return `${this.user.firstName} ${this.user.lastName}`;
  }

  hasError(form: string, control: string, validator: string): boolean {
    return (
      this[form].controls[control]?.touched &&
      this[form].controls[control].errors?.[validator]
    );
  }

  onFileUpload(event): void {
    if (event.target.files && event.target.files.length) {
      this.file = event.target.files[0];
    } else {
      this.file = null;
    }
  }

  submitProfile(): void {
    const data = new ProfileForm();
    data.FirstName = this.profileForm.value.firstName;
    data.LastName = this.profileForm.value.lastName;
    data.IsMarketingEmails = this.profileForm.value.marketing;
    data.UserId = this.user.userId;
    if (!!this.profileForm.value.image && !!this.file) data.photo = this.file;
    if (!!this.profileForm.value.phone)
      data.PhoneNumber = this.profileForm.value.phone;
    if (!!this.profileForm.value.position)
      data.Position = this.profileForm.value.position;

    this.api.updateProfile(data).subscribe((res) => {
      if (res && res.succeeded) {
        this.profileForm.reset();
        this.file = null;
        this.toster.success(res.message);
        this.store.dispatch(
          UpdateUserAction(
            Object.assign({}, this.user, {
              firstName: res.data.firstName,
              lastName: res.data.lastName,
              marketingEmails: res.data.marketingEmails,
              phoneNumber: res.data.phoneNumber,
              position: res.data.position,
              profilePhoto: res.data.profilePhoto,
            })
          )
        );
        this.profileForm.patchValue({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          marketing: res.data.marketingEmails,
          phone: res.data.phoneNumber,
          position: res.data.position,
        });
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      }
    });
  }

  changePassword(): void {
    this.api
      .changePassword(this.user.userId, this.changePasswordForm.value.password)
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
}
