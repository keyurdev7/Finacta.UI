import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AbstractService } from './abstract.service';
import { environment } from '../../../environments/environment';
import { LoadingMaskService } from './loading-mask.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { InviteUserForm } from 'src/app/models/invite-user-form.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyUsersService extends AbstractService {
  readonly baseUrl: string = environment.application_host + '/api';

  constructor(httpClient: HttpClient, loadingMaskService: LoadingMaskService) {
    super(httpClient, loadingMaskService);
  }

  getCompanyUsers(token: string): Observable<any> {
    return this.httpGet({
      url: this.baseUrl + '/UserManagement/GetCompanyUser',
      params: new HttpParams(),
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  inviteUser(data: InviteUserForm): Observable<any> {
    return this.httpPost({
      url: this.baseUrl + '/UserManagement/InviteUser',
      payload: data,
      callerErrorHandler: false,
    }) as Observable<any>;
  }
}