import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AbstractService } from './abstract.service';
import { LoadingMaskService } from './loading-mask.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService extends AbstractService {
  readonly baseUrl: string = environment.application_host + '/api';

  constructor(httpClient: HttpClient, loadingMaskService: LoadingMaskService) {
    super(httpClient, loadingMaskService);
  }

  getAllActiveUser(): Observable<any> {
    return this.httpGet({
      url: this.baseUrl + '/ChatManagement/GetActiveChatUserList',
      params: new HttpParams(),
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  getSearchUser(): Observable<any> {
    return this.httpGet({
      url: this.baseUrl + '/ChatManagement/GetChatUserList',
      params: new HttpParams(),
      callerErrorHandler: false,
    }) as Observable<any>;
  }
}
