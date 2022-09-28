import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { AppState, userSelector } from 'src/app/store/app.state';
import { User } from 'src/app/models/user.model';

import { PaymentIntent } from '@stripe/stripe-js';
import Stripe from 'stripe';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private static readonly BASE_URL = 'https://api.pluto.ricardosanchez.dev/api';
  paymentKey: any = environment.paymentKey;
  paymentHandler: any = null;
  subscriptions: Subscription[] = [];
  user: User = new User();

  constructor(
    public router: Router,
    public store: Store<AppState>,
    private readonly http: HttpClient
  ) {}

  ngOnInit() {}

  subscribeToUser() {
    this.subscriptions.push(
      this.store.pipe(userSelector).subscribe((res) => {
        this.user = res;
      })
    );
  }

  makePaymentstripe(amount: any) {
    // if (!this.totalpayment) {
    //   this._location.back();
    // }
    return new Promise((resolve, reject) => {
      const paymentHandler = (<any>window).StripeCheckout.configure({
        key: this.paymentKey,
        locale: 'auto',
        Customer: this.user.userId,
        description: 'Subscription for 1 month',
        panelLabel: 'Sign Me Up!',
        object: 'customer',
        token: (tokenData: any) => {
          if (tokenData) {
            console.log('tokenData', tokenData);
            resolve(tokenData);
            // this.router.navigate(['/company']);
          } else {
            resolve(false);
          }
        },
      });
      paymentHandler.open({
        name: 'Finacta',
        description: 'Booking',
        amount: amount * 100,
        object: 'customer',
      });
    });
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: this.paymentKey,
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
            alert('Payment has been successfull!');
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }

  createPaymentIntent(
    params: Stripe.PaymentIntentCreateParams
  ): Observable<PaymentIntent> {
    let data: any = {};
    data.client_secret =
      'sk_test_51Jowr9HVkDEbtXkoEkCdny6WdCKie1UtU62XhwTwMPdHPJv5ZhWCEu3jjUbAN7lo0qDjF7b1BkbGJwCU1Hgm9p5h00iavUVpNZ';
    return data;
    // return this.http.post<PaymentIntent>(
    //   `${PaymentService.BASE_URL}/payments/create-payment-intent`,
    //   params,
    //   { headers: { merchant: '123456' } }
    // );
  }
}
