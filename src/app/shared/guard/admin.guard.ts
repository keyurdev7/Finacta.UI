import { Injectable } from '@angular/core';
import {
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { first, Observable } from 'rxjs';
import { AppState, userSelector } from 'src/app/store/app.state';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivateChild {
  constructor(public router: Router, public store: Store<AppState>) {}

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Guard for user is login or not
    return new Observable<boolean>((obs) => {
      this.store
        .pipe(userSelector)
        .pipe(first())
        .subscribe((res) => {
          if (!res || !Object.keys(res).length || !res.userId) {
            this.router.navigate(['/auth/login']);
            obs.next(true);
          } else if (!res.isPortalSubscibe && state.url !== '/pricing') {
            this.router.navigate(['/pricing']);
            obs.next(true);
          } else if (!!res.isPortalSubscibe && state.url === '/pricing') {
            this.router.navigate(['/dashboard']);
            obs.next(true);
          }
          obs.next(true);
        });
    });
  }
}
