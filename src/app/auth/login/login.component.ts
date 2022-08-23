import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/firebase/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public show: boolean = false;
  public loginForm: FormGroup | any;
  public errorMessage: any;

  constructor(public authService: AuthService, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['spruko@template.com', [Validators.required, Validators.email]],
      password: ['spruko', Validators.required],
    });

    document.querySelector('body')?.classList.add('login-img');
  }

  ngOnInit() {}

  showPassword() {
    this.show = !this.show;
  }

  // Login With Google
  loginGoogle() {
    this.authService.GoogleAuth();
  }

  // Login With Twitter
  loginTwitter(): void {
    this.authService.signInTwitter();
  }

  // Login With Facebook
  loginFacebook() {
    this.authService.signInFacebok();
  }

  // Simple Login
  login() {
    this.authService.SignIn(
      this.loginForm.value['email'],
      this.loginForm.value['password']
    );
  }

  ngOnDestroy() {
    document.querySelector('body')?.classList.remove('login-img');
  }
}
