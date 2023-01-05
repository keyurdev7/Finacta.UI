import { Component, Inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import { Subscription } from 'rxjs';
import {
  StripeCardElementChangeEvent,
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { APIService } from 'src/app/shared/services/api.service';
import { Store } from '@ngrx/store';
import {
  AppState,
  stripeKeySelector,
  userSelector,
} from 'src/app/store/app.state';
import { UpdateUserAction } from 'src/app/store/app.actions';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-subscription-modal',
  templateUrl: './subscription-modal.component.html',
  styleUrls: ['./subscription-modal.component.scss'],
})
export class SubscriptionModalComponent implements OnInit, OnDestroy {
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;
  cardOptions: StripeCardElementOptions = {
    hidePostalCode: true,
    style: {
      base: {
        iconColor: '#495057bf',
        fontFamily: '"Poppins", sans-serif',
        fontSize: '14px',
        fontWeight: 400,
        color: '#495057bf',
        '::placeholder': {
          color: '#495057bf',
        },
      },
    },
  };
  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };
  validCard: boolean = false;
  user: User = new User();
  subscriptions: Subscription[] = [];
  paymentMethodDetails: any;
  subscriptionResponse: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public companyId: number,
    public dialogRef: MatDialogRef<SubscriptionModalComponent>,
    public toster: ToastrService,
    private stripeService: StripeService,
    private api: APIService,
    public store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.subscribeToStripeService();
    this.subscribeToUser();
  }

  subscribeToUser() {
    this.subscriptions.push(
      this.store.pipe(userSelector).subscribe((res) => {
        this.user = res;
      })
    );
  }

  subscribeToStripeService() {
    this.subscriptions.push(
      this.store.pipe(stripeKeySelector).subscribe((res) => {
        this.stripeService.changeKey(res.key);
      })
    );
  }

  cardChange(e: StripeCardElementChangeEvent): void {
    this.validCard = e.complete;
  }
  makePayment(): void {
    this.stripeService
      .createPaymentMethod({
        type: 'card',
        card: this.card.element,
        billing_details: { name: '' },
      })
      .subscribe(
        (result) => {
          this.paymentMethodDetails = result;
          if (this.paymentMethodDetails?.paymentMethod?.id) {
            this.api
              .createStripeSubscription(this.paymentMethodDetails.paymentMethod.id, this.companyId)
              .subscribe(
                (res) => {
                  this.subscriptionResponse = res;
                  if (this.subscriptionResponse && this.subscriptionResponse.succeeded) {
                    this.stripeService.confirmCardPayment(this.subscriptionResponse.data.clientSecret, {
                      payment_method: this.paymentMethodDetails.paymentMethod.id,
                    }).subscribe(
                      (confirmPaymentResponse) => {
                        if (confirmPaymentResponse && confirmPaymentResponse.paymentIntent && confirmPaymentResponse.paymentIntent.payment_method) {
                          this.api
                            .createStripeSuccessPayment(this.subscriptionResponse.data.resSubscription.id)
                            .subscribe(
                              (stripeSuccessPaymentResponse) => {
                                console.log("stripeSuccessPaymentResponse", stripeSuccessPaymentResponse);
                                if (this.subscriptionResponse && this.subscriptionResponse.succeeded) {
                                  this.store.dispatch(
                                    UpdateUserAction(
                                      Object.assign({}, this.user, {
                                        userCompany: this.subscriptionResponse.data.userCompany,
                                      })
                                    )
                                  );
                                  this.dialogRef.close({
                                    event: 'success',
                                    message: stripeSuccessPaymentResponse.message || 'Payment Successful',
                                  });
                                } else if (res && res.errors.length) {
                                  res.errors.forEach((err) => {
                                    this.toster.error(err.errorMessage);
                                  });
                                  this.dialogRef.close({ event: 'cancel' });
                                }
                              },
                              (error) => {
                                this.toster.error("Something went wrong, please try again!");
                                this.dialogRef.close({ event: 'cancel' });
                              });
                        } else {
                          this.toster.error("Something went wrong, please try again!");
                          this.dialogRef.close({ event: 'cancel' });
                        }
                      },
                      (error) => {
                        this.toster.error("Something went wrong, please try again!");
                        this.dialogRef.close({ event: 'cancel' });
                      });
                  } else if (res && res.errors.length) {
                    res.errors.forEach((err) => {
                      this.toster.error(err.errorMessage);
                    });
                    this.dialogRef.close({ event: 'cancel' });
                  }
                }, (error) => {
                  this.toster.error("Something went wrong, please try again!");
                  this.dialogRef.close({ event: 'cancel' });
                });
          } else {
            this.toster.error("Something went wrong, please try again!");
            this.dialogRef.close({ event: 'cancel' });
          }
        },
        (error) => {
          this.toster.error("Something went wrong, please try again!");
          this.dialogRef.close({ event: 'cancel' });
        }
      );
  }
  /*makePayment(): void {
    this.api
      .createStripePaymentIntent()
      .subscribe(
        (paymentIntentResponse) => {
          if (paymentIntentResponse && paymentIntentResponse.succeeded) {
            if (paymentIntentResponse.data) {
              this.stripeService.confirmCardPayment(paymentIntentResponse.data, {
                payment_method: {
                  card: this.card.element,
                  billing_details: {
                    name: '',
                  },
                },
              }).subscribe(
                (confirmPaymentResponse) => {
                  if (confirmPaymentResponse && confirmPaymentResponse.paymentIntent && confirmPaymentResponse.paymentIntent.payment_method) {
                    this.api
                      .createStripeSubscription((confirmPaymentResponse.paymentIntent.payment_method).toString(), this.companyId)
                      .subscribe(
                        (res) => {
                          if (res && res.succeeded) {
                            this.store.dispatch(
                              UpdateUserAction(
                                Object.assign({}, this.user, {
                                  userCompany: res.data.userCompany,
                                })
                              )
                            );
                            this.dialogRef.close({
                              event: 'success',
                              message: res.message || 'Payment Successful',
                            });
                          } else if (res && res.errors.length) {
                            res.errors.forEach((err) => {
                              this.toster.error(err.errorMessage);
                            });
                            this.dialogRef.close({ event: 'cancel' });
                          }
                        }, (error) => {
                          this.toster.error("Something went wrong, please try again!");
                          this.dialogRef.close({ event: 'cancel' });
                        });
                  } else {
                    this.toster.error("Something went wrong, please try again!");
                    this.dialogRef.close({ event: 'cancel' });
                  }
                }, (error) => {
                  this.toster.error("Something went wrong, please try again!");
                  this.dialogRef.close({ event: 'cancel' });
                });
            } else {
              this.toster.error("Something went wrong, please try again!");
              this.dialogRef.close({ event: 'cancel' });
            }
          } else if (paymentIntentResponse && paymentIntentResponse.errors.length) {
            paymentIntentResponse.errors.forEach((err) => {
              this.toster.error(err.errorMessage);
            });
            this.dialogRef.close({ event: 'cancel' });
          }
        }, (error) => {
          this.toster.error("Something went wrong, please try again!");
          this.dialogRef.close({ event: 'cancel' });
        });
  }*/

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((eachSub) => eachSub.unsubscribe());
  }
}
