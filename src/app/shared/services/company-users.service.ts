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

  getCompanyUsers(): Observable<any> {
    return this.httpGet({
      url: this.baseUrl + '/UserManagement/GetCompanyUser',
      params: new HttpParams(),
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  getAllCompanies(): Observable<any> {
    return this.httpGet({
      url: this.baseUrl + '/CompanyManagement/GetMyCompanies',
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

  reSendInvitation(userId: number): Observable<any> {
    return this.httpPost({
      url: this.baseUrl + '/UserManagement/ResentInvitation?userid=' + userId,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  deleteCompanyUser(userId: number): Observable<any> {
    return this.httpDelete({
      url: this.baseUrl + '/UserManagement/DeleteUser?userid=' + userId,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  changeCompany(companyId: number): Observable<any> {
    return this.httpPost({
      url: this.baseUrl + '/Auth/CompanyChange?companyId=' + companyId,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  addCompany(companyData): Observable<any> {
    return this.httpPost({
      url: this.baseUrl + '/CompanyManagement/AddNewCompany',
      payload: companyData,
      callerErrorHandler: false,
    }) as Observable<any>;
  }
}
