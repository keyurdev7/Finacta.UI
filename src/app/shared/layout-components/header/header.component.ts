import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user.model';
import { UpdateUserAction } from 'src/app/store/app.actions';
import { AppState, userSelector } from 'src/app/store/app.state';
import {
  ADVISOR_USER_TYPE,
  MASTER_USER_TYPE,
} from '../../constants/common.constant';
import { APIService } from '../../services/api.service';
import { CompanyUsersService } from '../../services/company-users.service';
import { SwitcherService } from '../../services/switcher.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public isCollapsed = true;
  public user: User = new User();
  public companyId: number = 0;
  constructor(
    private router: Router,
    private store: Store<AppState>,
    private toster: ToastrService,
    private companyService: CompanyUsersService,
    public SwitcherService: SwitcherService,
    public apiService: APIService
  ) {}

  ngOnInit(): void {
    this.store.pipe(userSelector).subscribe((res) => {
      this.user = res;
      this.companyId = this.user.lastLoginCompanyId;
    });
  }

  changeCompany(): void {
    if (
      this.user.userTypeId == MASTER_USER_TYPE ||
      this.user.userTypeId == ADVISOR_USER_TYPE
    ) {
      this.companyService.selectCompany(this.companyId).subscribe((res) => {
        if (res && res.succeeded) {
          this.store.dispatch(UpdateUserAction(Object.assign({}, this.user, res.data)));
          this.reload();
        } else if (res && res.errors.length) {
          res.errors.forEach((err) => {
            this.toster.error(err.errorMessage);
          });
        } else if (res && !res.succeeded && res.data) {
          this.toster.error(res.data);
        }
      });
    } else {
      this.companyService.changeCompany(this.companyId).subscribe((res) => {
        if (res && res.succeeded) {
          this.store.dispatch(UpdateUserAction(Object.assign({}, this.user, res.data)));
          this.reload();
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

  toggleSwitcher() {
    this.SwitcherService.emitChange(true);
  }

  signout(): void {
    this.apiService.logOut().subscribe((res) => {});
    const user = new User();
    delete user.isPortalSubscibe;
    this.store.dispatch(UpdateUserAction(user));
    this.router.navigate(['/auth/login']);
  }
}
