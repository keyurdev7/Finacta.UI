import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Company } from 'src/app/models/company.model';
import { User } from 'src/app/models/user.model';
import { UpdateUserAction } from 'src/app/store/app.actions';
import { AppState, userSelector } from 'src/app/store/app.state';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
export class HeaderComponent implements OnInit, OnDestroy {
  public isCollapsed = true;
  public user: User = new User();
  public companyId: number = 0;
  public companySubscription: Subscription = new Subscription();
  public activeCompanies: Company[] = [];
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
    });
    this.companySubscription = this.getAllActiveCompanies();
  }

  getAllActiveCompanies(): Subscription {
    this.companySubscription.unsubscribe();
    return timer(0, 30000)
      .pipe(switchMap(() => this.companyService.getMyActiveCompanies()))
      .subscribe((res) => {
        if (res && res.succeeded && res.data && res.data[0]) {
          this.activeCompanies = res.data;
          this.companyId = this.user.lastLoginCompanyId;
        }
      });
  }

  showCompanyMenu(): boolean {
    if (
      this.user && this.user.accessMenu.find((a) => a.moduleName.toLowerCase() === 'company')
    ) {
      return true;
    }
    return false;
  }

  changeCompany(): void {
    if (
      this.user.userTypeId == MASTER_USER_TYPE ||
      this.user.userTypeId == ADVISOR_USER_TYPE
    ) {
      this.companyService.selectCompany(this.companyId).subscribe((res) => {
        if (res && res.succeeded) {
          this.store.dispatch(
            UpdateUserAction(Object.assign({}, this.user, res.data))
          );
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
          this.store.dispatch(
            UpdateUserAction(Object.assign({}, this.user, res.data))
          );
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

  ngOnDestroy(): void {
    this.companySubscription.unsubscribe();
  }
}
