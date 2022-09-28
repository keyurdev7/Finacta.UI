import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Subscription, switchMap } from 'rxjs';
import { SubsciptionPlan } from 'src/app/models/subscription-plan.model';
import { User } from 'src/app/models/user.model';
import { APIService } from 'src/app/shared/services/api.service';
import { CompanyUsersService } from 'src/app/shared/services/company-users.service';
import { PaymentService } from 'src/app/shared/services/payment-service';
import { UpdateUserAction } from 'src/app/store/app.actions';
import { AppState, userSelector } from 'src/app/store/app.state';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import { AngularStripeService } from '@fireflysemantics/angular-stripe-service';
@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent implements OnInit, OnDestroy {
  @ViewChild(StripeCardComponent, { static: true }) card: any =
    StripeCardComponent;

  subPlans: SubsciptionPlan = new SubsciptionPlan();
  user: User = new User();
  companyId = 0;
  IsFromCompanyList = false;
  subscriptions: Subscription[] = [];
  formObj: any = {
    holder_name: 'test',
    card_number: '4000056655665556',
    month: '02',
    year: '26',
    cvv: '123',
  };

  loading = false;
  confirmation;

  constructor(
    private api: APIService,
    public router: Router,
    public toster: ToastrService,
    private companyService: CompanyUsersService,
    public store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    public paymentService: PaymentService,
    private stripeService: StripeService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.companyId = params['id'];
      this.IsFromCompanyList = true;
    });
    this.paymentService.invokeStripe();

    if (this.companyId == 0) {
      this.companyId = this.user.lastLoginCompanyId;
    }

    this.subscribeToUser();

    this.getSubscriptionPlans();
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

  // need to do
  subscriptionPay(id?: number): void {
    this.api
      .saveSubscriptionPlan(this.user.userId, this.companyId)
      .subscribe((res) => {
        if (res && res.succeeded) {
          if (this.IsFromCompanyList) {
            this.toster.success(res.message);
            this.router.navigate(['/company']);
          } else {
            this.changeCompany(this.user.lastLoginCompanyId);
          }
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
        this.store.dispatch(UpdateUserAction(res.data));
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((eachSub) => eachSub.unsubscribe());
  }

  makePaymentstripe(amount: any) {
    this.paymentService.makePaymentstripe(amount).then((resp: any) => {
      if (resp && resp['id']) {
        this.subscriptionPay();
      }
    });
    // console.log('data', data);
  }

  pay(form: any): void {
    console.log('form', form);
    console.log('card', this.card.element);
    if (form.valid) {
      let client_secret =
        'sk_test_51Jowr9HVkDEbtXkoEkCdny6WdCKie1UtU62XhwTwMPdHPJv5ZhWCEu3jjUbAN7lo0qDjF7b1BkbGJwCU1Hgm9p5h00iavUVpNZ';

      this.stripeService
        .confirmCardPayment(client_secret, {
          payment_method: {
            card: this.card.element,
            billing_details: {
              name: this.formObj.holder_name,
            },
          },
        })
        .subscribe((result: any) => {
          if (result.error) {
            console.log('error', result);
            // Show error to your customer (e.g., insufficient funds)
            // this.openDialog({ success: false, error: result.error.message });
          } else {
            console.log(result);
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
              // Show a success message to your customer
              this.openDialog({ success: true });
            }
          }
        });

      return;
      // this.paying = true;
      this.paymentService
        .createPaymentIntent({
          amount: this.subPlans.subscriptionPrice,
          currency: 'eur',
        })
        .pipe(
          switchMap((pi: any) =>
            this.stripeService.confirmCardPayment('pi.client_secret', {
              payment_method: {
                card: this.card.element,
                billing_details: {
                  name: this.formObj.holder_name,
                },
              },
            })
          )
        )
        .subscribe((result: any) => {
          // this.paying = false;
          if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            this.openDialog({ success: false, error: result.error.message });
          } else {
            console.log(result);
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
              // Show a success message to your customer
              this.openDialog({ success: true });
            }
          }
        });
    } else {
      console.log(form);
    }
  }

  openDialog(data) {
    // this.dialog.open(AppDialogComponent, { data });
  }
}
