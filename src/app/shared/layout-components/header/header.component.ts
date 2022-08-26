import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  signout() {
    this.cookieService.delete('user');
    this.cookieService.deleteAll('user', '/auth/login');
    this.router.navigate(['/auth/login']);
  }
}
