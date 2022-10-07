import { Injectable } from "@angular/core";
import { AbstractService } from "./abstract.service";
import { environment } from "src/environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { LoadingMaskService } from "./loading-mask.service";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
  })
  export class SettingService extends AbstractService{
    readonly baseUrl: string = environment.application_host + '/api';

    constructor(httpClient: HttpClient, loadingMaskService: LoadingMaskService) {
        super(httpClient, loadingMaskService);
      }
      
      getAllXeroContacts(): Observable<any> {
        return this.httpGet({
          url: this.baseUrl + '/XeroManagement/GetAllXeroContacts',
          params: new HttpParams(),
          callerErrorHandler: false,
        }) as Observable<any>;
      }

      getCompaniesLinkedWithXeroContact(): Observable<any> {
        return this.httpGet({
          url: this.baseUrl + '/XeroManagement/GetCompaniesLinkedWithXeroContact',
          params: new HttpParams(),
          callerErrorHandler: false,
        }) as Observable<any>;
      }

      syncXeroContacts(): Observable<any> {
        const body = new FormData();
        return this.httpPost({
          url: this.baseUrl + '/XeroManagement/SyncXeroContacts',
          payload: body,
          callerErrorHandler: false,
        }) as Observable<any>;
      }

      syncXeroInvoices(companyid:number): Observable<any> {
        return this.httpPost({
          url: this.baseUrl + '/XeroManagement/syncXeroInvoices?companyId='+companyid,
          callerErrorHandler: false,
        }) as Observable<any>;
      }
  }
