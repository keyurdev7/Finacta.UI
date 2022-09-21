import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user.model';
import { UpdateUserAction } from 'src/app/store/app.actions';
import { AppState, userSelector } from 'src/app/store/app.state';
import { CompanyUsersService } from '../../services/company-users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public isCollapsed = true;
  public user: User = new User();
  constructor(
    private router: Router,
    private store: Store<AppState>,
    private toster: ToastrService,
    private companyService: CompanyUsersService,
  ) {}

  ngOnInit(): void {
    this.store.pipe(userSelector).subscribe((res) => {
      this.user = res;
    });
  }

  changeCompany(value): void {
    debugger;
    if (this.user.userTypeId == 1 || this.user.userTypeId == 3) {
      this.companyService.selectCompany(value).subscribe((res) => {
        if (res && res.succeeded) {
          this.reload();
          this.store.dispatch(UpdateUserAction(res.data));
        } else if (res && res.errors.length) {
          res.errors.forEach((err) => {
            this.toster.error(err.errorMessage);
          });
        } else if (res && !res.succeeded && res.data) {
          this.toster.error(res.data);
        }
      });
    } else {
      this.companyService.changeCompany(value).subscribe((res) => {
        if (res && res.succeeded) {
          this.reload();
          this.store.dispatch(UpdateUserAction(res.data));
          this.toster.success('Company changed successfully');
        } else if (res && res.errors.length) {
          res.errors.forEach((err) => {
            this.toster.error(err.errorMessage);
          });
        } else if (res && !res.succeeded && res.data) {
          this.toster.error(res.data);
        }
      });
    }
  }

  reload() {
    window.location.reload();
  }

  signout(): void {
    const user = new User();
    delete user.isPortalSubscibe;
    this.store.dispatch(UpdateUserAction(user));
    this.router.navigate(['/auth/login']);
  }
}
