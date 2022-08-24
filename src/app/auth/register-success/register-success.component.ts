import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register-success',
  templateUrl: './register-success.component.html',
  styleUrls: ['./register-success.component.scss'],
})
export class RegisterSuccessComponent implements OnInit {
  constructor(private _location: Location) {
    document.querySelector('body')?.classList.add('login-img');
  }

  ngOnInit(): void {}

  backClicked() {
    this._location.back();
  }

  ngOnDestroy() {
    document.querySelector('body')?.classList.remove('login-img');
  }
}
