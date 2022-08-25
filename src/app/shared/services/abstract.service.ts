import { environment } from '../../../environments/environment';
import { LoadingMaskService } from './loading-mask.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

export const CALLER_ERROR_HANDLER_KEY = 'e';

export class AbstractService {
  constructor(
    protected httpClient: HttpClient,
    protected loadingMaskService: LoadingMaskService
  ) {}

  protected log(
    message: string,
    isError: boolean = false,
    object: any = null
  ): void {
    if (!environment.production) {
      message += ' ' + (object !== null ? JSON.stringify(object, null, 2) : '');
      isError ? console.error(message) : console.log(message);
    }
  }

  protected deserialise<T>(json: any, targetClass: ClassConstructor<T>): any {
    return plainToClass(targetClass, json);
  }

  protected mask(): void {
    this.loadingMaskService.mask();
  }

  unmask(): void {
    this.loadingMaskService.unmask();
  }

  private httpRequest<T>(
    httpObservable: Observable<Object>,
    context: { returnType?: ClassConstructor<T>; noLoadingMask?: boolean }
  ): Observable<T | T[]> {
    if (!context.noLoadingMask) {
      this.mask();
    }

    const observable = httpObservable
      .pipe(
        map((result) => {
          if (context.returnType) {
            return this.deserialise(result, context.returnType);
          }
          return result;
        })
      )
      .pipe(
        finalize(() => {
          if (!context.noLoadingMask) {
            this.unmask();
          }
        })
      );

    return observable;
  }

  private updateErrorParam(context: {
    params?: HttpParams;
    callerErrorHandler?: boolean;
  }): void {
    if (context.callerErrorHandler === true) {
      const params = context.params ? context.params : new HttpParams();
      context.params = params.append(CALLER_ERROR_HANDLER_KEY, 'true');
    }
  }

  httpGet<T>(context: {
    url: string;
    returnType?: ClassConstructor<T>;
    params?: HttpParams;
    noLoadingMask?: boolean;
    callerErrorHandler?: boolean;
    observe?: any;
  }): Observable<T | T[]> {
    this.updateErrorParam(context);
    return this.httpRequest(
      this.httpClient.get(context.url, {
        params: context.params,
        observe: context.observe,
      }),
      context
    );
  }

  httpPost<T>(context: {
    url: string;
    payload?: any;
    returnType?: ClassConstructor<T>;
    params?: HttpParams;
    headers?: HttpHeaders;
    noLoadingMask?: boolean;
    callerErrorHandler?: boolean;
  }): Observable<T | T[]> {
    this.updateErrorParam(context);
    return this.httpRequest(
      this.httpClient.post(context.url, context.payload, {
        params: context.params,
        headers: context.headers,
      }),
      context
    );
  }
}
