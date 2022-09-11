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
export class BlogService extends AbstractService {
  readonly baseUrl: string = environment.application_host + '/api';

  constructor(httpClient: HttpClient, loadingMaskService: LoadingMaskService) {
    super(httpClient, loadingMaskService);
  }

  getAllBlogs(): Observable<any> {
    return this.httpGet({
      url: this.baseUrl + '/BlogManagement/GetMyBlogs',
      params: new HttpParams(),
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  getAllCategories(): Observable<any> {
    return this.httpGet({
      url: this.baseUrl + '/BlogManagement/BlogCategories',
      params: new HttpParams(),
      noLoadingMask: true,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  publishBlog(blogId: number): Observable<any> {
    const params = new HttpParams().append('blogId', blogId);
    return this.httpGet({
      url: this.baseUrl + '/BlogManagement/PublishBlog',
      params: params,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  unPublishBlog(blogId: number): Observable<any> {
    const params = new HttpParams().append('blogId', blogId);
    return this.httpGet({
      url: this.baseUrl + '/BlogManagement/UnPublishBlog',
      params: params,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  deleteBlog(blogId: number): Observable<any> {
    const params = new HttpParams().append('blogId', blogId);
    return this.httpGet({
      url: this.baseUrl + '/BlogManagement/DeleteBlog',
      params: params,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  addBlog(data: AddEditBlogForm): Observable<any> {
    return this.httpPost({
      url: this.baseUrl + '/BlogManagement/AddNewBlog',
      payload: data,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  updateBlog(data: AddEditBlogForm): Observable<any> {
    return this.httpPost({
      url: this.baseUrl + '/BlogManagement/UpdateBlog',
      payload: data,
      callerErrorHandler: false,
    }) as Observable<any>;
  }
}
