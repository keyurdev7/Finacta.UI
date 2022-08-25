import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { SubsciptionPlan } from 'src/app/models/subscription-plan.model';
import { APIService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent implements OnInit {
  subPlans: SubsciptionPlan = new SubsciptionPlan();
  constructor(private api: APIService, public toster: ToastrService, public cookieService: CookieService) {}

  ngOnInit(): void {
    this.getSubscriptionPlans();
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

  subscriptionPay(id: number): void {
    console.log(id);
  }
}
