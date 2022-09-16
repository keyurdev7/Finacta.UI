import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AbstractService } from './abstract.service';
import { environment } from '../../../environments/environment';
import { LoadingMaskService } from './loading-mask.service';
import { AddEditBlogForm } from 'src/app/models/add-edit-blog-form.model';

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
}
