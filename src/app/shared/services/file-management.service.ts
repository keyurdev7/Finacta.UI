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
export class FileManagementService extends AbstractService {
  readonly baseUrl: string = environment.application_host + '/api';

  constructor(httpClient: HttpClient, loadingMaskService: LoadingMaskService) {
    super(httpClient, loadingMaskService);
  }

  getData(id: number = 0): Observable<any> {
    const params = new HttpParams().append('parentFolderId', id);
    return this.httpGet({
      url: this.baseUrl + '/FileManagement/GetFolderFileList',
      params: params,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  getBreadcrumbData(id: number = 0): Observable<any> {
    const params = new HttpParams().append('folderId', id);
    return this.httpGet({
      url: this.baseUrl + '/FileManagement/GetFolderParent',
      params: params,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  delete(id: number): Observable<any> {
    const params = new HttpParams().append('folderId', id);
    return this.httpGet({
      url: this.baseUrl + '/FileManagement/DeleteFolder',
      params: params,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  deleteFile(id: number): Observable<any> {
    const params = new HttpParams().append('fileId', id);
    return this.httpGet({
      url: this.baseUrl + '/FileManagement/DeleteFile',
      params: params,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  addFolder(id: number, name: string): Observable<any> {
    const data = {
      folderName: name,
      parentFolderId: id,
    };
    return this.httpPost({
      url: this.baseUrl + '/FileManagement/AddFolder',
      payload: data,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  addFile(data: AddFile): Observable<any> {
    const body = new FormData();
    Object.keys(data).forEach((key) => {
      body.append(key, data[key]);
    });
    return this.httpPost({
      url: this.baseUrl + '/FileManagement/AddFile',
      payload: body,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  search(id: number, search: string = ''): Observable<any> {
    const params = new HttpParams()
      .append('parentFolderId', id)
      .append('searchFileName', search);
    return this.httpGet({
      url: this.baseUrl + '/FileManagement/SearchFile',
      params: params,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  getActiveCompanies(): Observable<any> {
    return this.httpGet({
      url: this.baseUrl + '/FileManagement/GetActiveCompanyList',
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  copyToCustomer(id: number): Observable<any> {
    const params = new HttpParams().append('toCompanyId', id);
    return this.httpGet({
      url: this.baseUrl + '/FileManagement/CopyToCustomer',
      params: params,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  approveFile(id): Observable<any> {
    const params = new HttpParams().append('fileId', id);
    return this.httpGet({
      url: this.baseUrl + '/FileManagement/ApproveFile',
      params: params,
      callerErrorHandler: false,
    }) as Observable<any>;
  }
}
