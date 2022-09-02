import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { ResisterComponent } from './resister/resister.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { RegisterSuccessComponent } from './register-success/register-success.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyUserVerificationComponent } from './company-user-verification/company-user-verification.component';

@NgModule({
  declarations: [
    LoginComponent,
    ResisterComponent,
    ForgetPasswordComponent,
    RegisterSuccessComponent,
    EmailVerificationComponent,
    ResetPasswordComponent,
    CompanyUserVerificationComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
})
export class AuthModule {}
