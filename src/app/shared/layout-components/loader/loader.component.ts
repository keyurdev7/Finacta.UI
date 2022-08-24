import { Component, OnInit, Input, Inject } from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  Event as NavigationEvent,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { LoadingMaskService } from '../../services/loading-mask.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  public showLoader: boolean = true;
  public isSpinnerVisible = true;
  public subscription: Subscription[] = [];
  @Input() display = false;

  constructor(
    private router: Router,
    private loadingMaskService: LoadingMaskService
  ) {
    this.router.events.subscribe({
      next: (event: NavigationEvent) => {
        if (event instanceof NavigationStart) {
          this.isSpinnerVisible = true;
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.isSpinnerVisible = false;
        }
      },
      error: (e) => (this.isSpinnerVisible = false),
    });
  }

  ngOnInit(): void {
    this.subscription.push(
      this.loadingMaskService.subscribe(
        (show) => (this.isSpinnerVisible = show)
      )
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((eachSubscription) =>
        eachSubscription.unsubscribe()
      );
    }
  }
}
