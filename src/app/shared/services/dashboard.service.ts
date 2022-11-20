import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AbstractService } from './abstract.service';
import { environment } from '../../../environments/environment';
import { LoadingMaskService } from './loading-mask.service';
import { AddFile } from 'src/app/models/add-file.model';

@Injectable({
    providedIn: 'root',
  })

  export class DashBoardManagementService extends AbstractService {
    readonly baseUrl: string = environment.application_host + '/api';
  
    constructor(httpClient: HttpClient, loadingMaskService: LoadingMaskService) {
      super(httpClient, loadingMaskService);
    }
  
    getReport(): Observable<any> {
      return this.httpGet({
        url: this.baseUrl + '/DashBoard/GetEmbedInfo',
        callerErrorHandler: false,
      }) as Observable<any>;
    }
  }
  