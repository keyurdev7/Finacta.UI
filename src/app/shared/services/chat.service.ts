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

  getAllActiveUser(loadingMask: boolean = false): Observable<any> {
    return this.httpGet({
      url: this.baseUrl + '/ChatManagement/GetActiveChatUserList',
      params: new HttpParams(),
      noLoadingMask: loadingMask,
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

  getChat(userId, lastMessageId): Observable<any> {
    const params = new HttpParams()
      .append('selecteUserId', userId)
      .append('lastMessageChatId', lastMessageId);
    return this.httpGet({
      url: this.baseUrl + '/ChatManagement/GetChatByUserId',
      params: params,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  getLastestChatByUserId(userId, lastMessageId): Observable<any> {
    const params = new HttpParams()
      .append('selecteUserId', userId)
      .append('lastMessageChatId', lastMessageId);
    return this.httpGet({
      url: this.baseUrl + '/ChatManagement/GetLastestChatByUserId',
      noLoadingMask: true,
      params: params,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  searchInChat(userId, searchStr): Observable<any> {
    const params = new HttpParams()
      .append('selecteUserId', userId)
      .append('searchText', searchStr);
    return this.httpGet({
      url: this.baseUrl + '/ChatManagement/SearchChatByUserId',
      noLoadingMask: true,
      params: params,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  sendChat(userId, message): Observable<any> {
    const data = {
      SelecteUserId: userId,
      ChatText: message,
    };
    const body = new FormData();
    Object.keys(data).forEach((key) => {
      body.append(key, data[key]);
    });
    return this.httpPost({
      url: this.baseUrl + '/ChatManagement/AddChat',
      payload: body,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  addUserToChat(userId): Observable<any> {
    const params = new HttpParams().append('selecteUserId', userId);
    return this.httpGet({
      url: this.baseUrl + '/ChatManagement/AddUserToChatList',
      params: params,
      callerErrorHandler: false,
    }) as Observable<any>;
  }
}
