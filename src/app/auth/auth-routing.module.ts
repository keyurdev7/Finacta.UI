import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { LoginComponent } from './login/login.component';
import { ResisterComponent } from './resister/resister.component';
import { RegisterSuccessComponent } from './register-success/register-success.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CompanyUserVerificationComponent } from './company-user-verification/company-user-verification.component';

const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  { path: 'auth/register', component: ResisterComponent },
  { path: 'auth/forgot-password', component: ForgetPasswordComponent },
  { path: 'auth/register-success', component: RegisterSuccessComponent },
  { path: 'auth/email-verify', component: EmailVerificationComponent },
  { path: 'auth/invite-user', component: CompanyUserVerificationComponent },
  { path: 'auth/invite-advisor-user', component: CompanyUserVerificationComponent },
  { path: 'auth/setpassword', component: ResetPasswordComponent },
  { path: 'auth/setpassword/:id', component: ResetPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
