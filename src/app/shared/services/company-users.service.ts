import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AbstractService } from './abstract.service';
import { environment } from '../../../environments/environment';
import { LoadingMaskService } from './loading-mask.service';
import { InviteUserForm } from 'src/app/models/invite-user-form.model';
import { ActiveInActiveUserRequest } from 'src/app/models/active-inactive-user.model';

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

  inviteAdvisorUser(data: InviteUserForm): Observable<any> {
    return this.httpPost({
      url: this.baseUrl + '/UserManagement/InviteAdvisorUser',
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

  selectCompany(companyId: number): Observable<any> {
    return this.httpPost({
      url: this.baseUrl + '/Auth/SelectCompany?companyId=' + companyId,
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
  cancelCompanySubscription(companyId: number): Observable<any> {
    return this.httpGet({
      url:
        this.baseUrl +
        '/CompanyManagement/CancelCompanySubscription?companyId=' +
        companyId,
      params: new HttpParams(),
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  getCompanyPayments(companyId: number): Observable<any> {
    return this.httpGet({
      url:
        this.baseUrl +
        '/CompanyManagement/GetCompanyPayments?companyId=' +
        companyId,
      params: new HttpParams(),
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  activeInActiveUser(data: ActiveInActiveUserRequest): Observable<any> {
    return this.httpPost({
      url: this.baseUrl + '/UserManagement/InActiveUser',
      payload: data,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  getXeroContactList(): Observable<any> {
    return this.httpGet({
      url: this.baseUrl + '/XeroManagement/GetAllXeroContacts',
      params: new HttpParams(),
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  addCompanyXeroContactRelation(
    userId: number,
    xeroContactId: number,
    companyId: number
  ): Observable<any> {
    const data = {
      userId,
      xeroContactId,
      companyId,
    };
    return this.httpPost({
      url: this.baseUrl + '/XeroManagement/AddCompanyXeroContactRelation',
      payload: data,
      callerErrorHandler: false,
    }) as Observable<any>;
  }
}
