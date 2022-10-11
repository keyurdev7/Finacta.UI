import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import {
  StripeCardElementChangeEvent,
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { APIService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-subscription-modal',
  templateUrl: './subscription-modal.component.html',
  styleUrls: ['./subscription-modal.component.scss'],
})
export class SubscriptionModalComponent {
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public companyId: number,
    public dialogRef: MatDialogRef<SubscriptionModalComponent>,
    public toster: ToastrService,
    private stripeService: StripeService,
    private api: APIService
  ) {}

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
      .subscribe((result) => {
        if (result.paymentMethod) {
          this.api
            .createStripeSubscription(result.paymentMethod.id, this.companyId)
            .subscribe((res) => {
              if (res && res.succeeded) {
                this.dialogRef.close({
                  event: 'success',
                  message: res.message || 'Payment Successful',
                });
              } else if (res && res.errors.length) {
                res.errors.forEach((err) => {
                  this.toster.error(err.errorMessage);
                });
              }
            });
        } else if (result.error) {
          this.toster.error(result.error.message);
        }
      });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
