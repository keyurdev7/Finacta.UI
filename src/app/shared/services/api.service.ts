import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AbstractService } from './abstract.service';
import { environment } from '../../../environments/environment';
import { LoadingMaskService } from './loading-mask.service';
import { RegisterForm } from './../../models/register-form.model';

@Injectable({
  providedIn: 'root',
})
export class APIService extends AbstractService {
  readonly baseUrl: string = environment.application_host + '/api';

  constructor(httpClient: HttpClient, loadingMaskService: LoadingMaskService) {
    super(httpClient, loadingMaskService);
  }

  register(data: RegisterForm): Observable<any> {
    return this.httpPost({
      url: this.baseUrl + '/Auth/Register',
      payload: data,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  login(email: string, password: string): Observable<any> {
    const body = {
      email: email,
      password: password,
    };
    return this.httpPost({
      url: this.baseUrl + '/Auth/login',
      payload: body,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  emailVerify(token: string): Observable<any> {
    const params = new HttpParams().append('param', token);

    return this.httpGet({
      url: this.baseUrl + '/Auth/VerifyEmail',
      params: params,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  getSubscriptionPlans(): Observable<any>{
    return this.httpGet({
      url: this.baseUrl + '/SubscriptionManagement/GetPortalSubscription',
      params: new HttpParams(),
      callerErrorHandler: false,
    }) as Observable<any>;
  }
}
