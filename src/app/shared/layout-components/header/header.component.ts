import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Company } from 'src/app/models/company.model';
import { User } from 'src/app/models/user.model';
import {
  SetCompaniesAction,
  UpdateUserAction,
} from 'src/app/store/app.actions';
import {
  AppState,
  companiesSelector,
  userSelector,
} from 'src/app/store/app.state';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  ADVISOR_USER_TYPE,
  MASTER_USER_TYPE,
} from '../../constants/common.constant';
import { APIService } from '../../services/api.service';
import { CompanyUsersService } from '../../services/company-users.service';
import { SwitcherService } from '../../services/switcher.service';
import { ChatService } from '../../services/chat.service';
import { HeaderCompanies } from 'src/app/models/header-companies.model';

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
  public chatSubscription: Subscription = new Subscription();
  public activeCompanies: HeaderCompanies[] = [];
  constructor(
    private router: Router,
    private store: Store<AppState>,
    private toster: ToastrService,
    private companyService: CompanyUsersService,
    private chatService: ChatService,
    public SwitcherService: SwitcherService,
    public apiService: APIService
  ) {}

  ngOnInit(): void {
    this.store.pipe(userSelector).subscribe((res) => {
      this.user = res;
    });
    this.companySubscription = this.getAllActiveCompanies();
    this.chatSubscription = this.subscribeToChatUnreadCount();
  }

  subscribeToChatUnreadCount(): Subscription {
    this.chatSubscription.unsubscribe();
    return this.store.pipe(companiesSelector).subscribe((res) => {
      if (res.lstUserCompany && res.lstUserCompany[0]) {
        this.activeCompanies = res.lstUserCompany;
        this.companyId = this.user.lastLoginCompanyId;
      }
    });
  }

  getAllActiveCompanies(): Subscription {
    this.companySubscription.unsubscribe();
    return timer(0, 30000)
      .pipe(switchMap(() => this.chatService.getUnReadMessageCount()))
      .subscribe((res) => {
        this.store.dispatch(SetCompaniesAction(res.data));
      });
  }

  showCompanyMenu(): boolean {
    if (
      this.user &&
      this.user.accessMenu.find((a) => a.moduleName.toLowerCase() === 'company')
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

  getCompantText(text: string): string {
    return !!text ? text.trim() : '';
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
    this.chatSubscription.unsubscribe();
  }
}
