import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { StripeKey } from './models/stripe-key.model';
import { APIService } from './shared/services/api.service';
import { SetStripeKeyAction } from './store/app.actions';
import { AppState } from './store/app.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private api: APIService, public store: Store<AppState>) {}

  ngOnInit() {
    this.api.getStripeKey().subscribe((res) => {
      if (res && res.succeeded) {
        const stripeKey = new StripeKey();
        stripeKey.key = res.data;
        this.store.dispatch(SetStripeKeyAction(stripeKey));
      }
    });
  }
}
