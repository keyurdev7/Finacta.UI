import { Component, OnInit, ViewChild } from '@angular/core';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { StripeDemoService } from 'src/app/shared/services/stripe-demo.service';
import { AppState, userSelector } from 'src/app/store/app.state';
import { User } from 'src/app/models/user.model';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-stripe-demo',
  templateUrl: './stripe-demo.component.html',
  styleUrls: ['./stripe-demo.component.scss'],
})
export class StripeDemoComponent implements OnInit {
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0',
        },
      },
    },
  };
  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };
  customerID;
  PaymentMethodID;
  public user: User = new User();

  constructor(
    private stripeService: StripeService,
    private stripeDemoService: StripeDemoService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.store.pipe(userSelector).subscribe((res) => {
      this.user = res;
    });
  }

  createToken(): void {
    this.stripeDemoService
      .createCustomer({ email: this.user.emailId })
      .subscribe((res: any) => {
        this.customerID = res.customer.id;
        this.stripeService
          .createPaymentMethod({
            type: 'card',
            card: this.card.element,
            billing_details: { name: '' },
          })
          .subscribe((result) => {
            if (result.paymentMethod) {
              const pack = {
                paymentMethodId: result.paymentMethod,
                customerID: this.customerID,
                priceId: 'price_1LkWJwHVkDEbtXkoYZCu03y9',
              }; // Send the payment method and customer ID to your server
              this.stripeDemoService
                .StartSubscription(pack)
                .subscribe((res) => {
                  console.log(res);
                });
              console.log(result.paymentMethod.id);
            } else if (result.error) {
              // Error creating the token
              console.log(result.error.message);
            }
          });
      });
  }
}
