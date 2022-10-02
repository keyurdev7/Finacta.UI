import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppState, userSelector } from 'src/app/store/app.state';
import { first, mergeMap, Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private store: Store<AppState>) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.store.pipe(userSelector).pipe(
      first(),
      mergeMap((user) => {
        const authReq =
          user && user.token && !request.url.includes('4242')
            ? request.clone({
                setHeaders: { Authorization: user.token },
              })
            : request;
        return next.handle(authReq);
      })
    );
  }
}
