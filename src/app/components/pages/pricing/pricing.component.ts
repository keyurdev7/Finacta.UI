import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SubsciptionPlan } from 'src/app/models/subscription-plan.model';
import { User } from 'src/app/models/user.model';
import { APIService } from 'src/app/shared/services/api.service';
import { CompanyUsersService } from 'src/app/shared/services/company-users.service';
import { UpdateUserAction } from 'src/app/store/app.actions';
import { AppState, userSelector } from 'src/app/store/app.state';
import { SubscriptionModalComponent } from './subscription-modal/subscription-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { PromocodeService } from 'src/app/shared/services/promocode.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent implements OnInit, OnDestroy {
  subPlans: SubsciptionPlan = new SubsciptionPlan();
  user: User = new User();
  companyId: number = 0;
  IsFromCompanyList: boolean = false;
  promoCodeApplied: boolean = false;
  promoCode: string = '';
  subscriptions: Subscription[] = [];
  constructor(
    private api: APIService,
    public router: Router,
    public toster: ToastrService,
    private companyService: CompanyUsersService,
    private promoCodeService: PromocodeService,
    public store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.companyId = params['id'];
      this.IsFromCompanyList = !!this.companyId;
    });

    this.subscribeToUser();
    this.getSubscriptionPlans();

    if (!this.companyId || this.companyId == 0) {
      this.companyId = this.user.lastLoginCompanyId;
    }
  }

  applyPromo(): void {
    this.promoCodeService.checkPromoCode(this.promoCode).subscribe((res) => {
      if (res && res.succeeded) {
        this.promoCodeApplied = true;
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      }
    });
  }

  activatePromo(): void {
    this.promoCodeService
      .ActivatePromoCode(this.promoCode, this.companyId)
      .subscribe((res) => {
        if (res && res.succeeded) {
          if (this.IsFromCompanyList) {
            this.router.navigate(['/company']);
          } else {
            this.changeCompany(this.user.lastLoginCompanyId);
          }
        } else if (res && res.errors.length) {
          res.errors.forEach((err) => {
            this.toster.error(err.errorMessage);
          });
        } else if (res && !res.succeeded && res.data) {
          this.toster.error(res.data);
        }
      });
  }

  cancelPromo(): void {
    this.promoCodeApplied = false;
    this.promoCode = '';
  }

  subscribeToUser() {
    this.subscriptions.push(
      this.store.pipe(userSelector).subscribe((res) => {
        this.user = res;
      })
    );
  }

  getSubscriptionPlans(): void {
    this.api.getSubscriptionPlans().subscribe((res) => {
      if (res && res.succeeded) {
        this.subPlans = res.data;
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      }
    });
  }

  changeCompany(value): void {
    this.companyService.changeCompany(value).subscribe((res) => {
      if (res && res.succeeded) {
        this.store.dispatch(
          UpdateUserAction(Object.assign({}, this.user, res.data))
        );
        this.router.navigate(['/dashboard']);
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      } else if (res && !res.succeeded && res.data) {
        this.toster.error(res.data);
      }
    });
  }

  openSubscriptionDialog(): void {
    if (this.promoCodeApplied && this.promoCode) {
      this.activatePromo();
    } else {
      const dialog = this.dialog.open(SubscriptionModalComponent, {
        minWidth: '40%',
        data: parseInt(this.companyId.toString()),
      });
      dialog.afterClosed().subscribe((result) => {
        if (result?.event === 'success') {
          this.toster.success(result.message);
          if (this.IsFromCompanyList) {
            this.router.navigate(['/company']);
          } else {
            this.changeCompany(this.user.lastLoginCompanyId);
          }
        }
        return;
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((eachSub) => eachSub.unsubscribe());
  }
}
