import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AbstractService } from './abstract.service';
import { environment } from '../../../environments/environment';
import { LoadingMaskService } from './loading-mask.service';
import { InviteUserForm } from 'src/app/models/invite-user-form.model';
import { ActiveInActiveUserRequest } from 'src/app/models/active-inactive-user.model';
import { PromoCodeForm } from 'src/app/models/promo-code-form.model';

@Injectable({
  providedIn: 'root',
})
export class PromocodeService extends AbstractService {
  readonly baseUrl: string = environment.application_host + '/api';

  constructor(httpClient: HttpClient, loadingMaskService: LoadingMaskService) {
    super(httpClient, loadingMaskService);
  }

  getActivePromoCodes(): Observable<any> {
    return this.httpGet({
      url: this.baseUrl + '/PromoCodeManagement/GetActivePromoCodes',
      params: new HttpParams(),
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  getAllPromoCodes(): Observable<any> {
    return this.httpGet({
      url: this.baseUrl + '/PromoCodeManagement/GetAllPromoCodes',
      params: new HttpParams(),
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  ActivatePromoCode(id: number): Observable<any> {
    const params = new HttpParams().append('promoCodeId', id);
    return this.httpGet({
      url: this.baseUrl + '/PromoCodeManagement/ActivatePromoCode',
      params: params,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  deletePromoCode(id: number): Observable<any> {
    const params = new HttpParams().append('promoCodeId', id);
    return this.httpGet({
      url: this.baseUrl + '/PromoCodeManagement/DeletePromoCode',
      params: params,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  addPromoCode(data: PromoCodeForm): Observable<any> {
    const body = new FormData();
    Object.keys(data).forEach((key) => {
      body.append(key, data[key]);
    });
    return this.httpPost({
      url: this.baseUrl + '/PromoCodeManagement/AddNewPromoCode',
      payload: body,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  updatePromoCode(data: PromoCodeForm): Observable<any> {
    const body = new FormData();
    Object.keys(data).forEach((key) => {
      body.append(key, data[key]);
    });
    return this.httpPost({
      url: this.baseUrl + '/PromoCodeManagement/UpdatePromoCode',
      payload: body,
      callerErrorHandler: false,
    }) as Observable<any>;
  }
}
