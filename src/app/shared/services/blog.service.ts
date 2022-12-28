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
    const body = new FormData();
    Object.keys(data).forEach((key) => {
      body.append(key, data[key]);
    });
    return this.httpPost({
      url: this.baseUrl + '/BlogManagement/AddNewBlog',
      payload: body,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  updateBlog(data: AddEditBlogForm): Observable<any> {
    const body = new FormData();
    Object.keys(data).forEach((key) => {
      body.append(key, data[key]);
    });
    return this.httpPost({
      url: this.baseUrl + '/BlogManagement/UpdateBlog',
      payload: body,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  blogPublishedcategories(): Observable<any> {
    return this.httpGet({
      url: this.baseUrl + '/BlogManagement/BlogPublishedCategories',
      params: new HttpParams(),
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  getAllPublishedBlogs(id: number = 0): Observable<any> {
    const params = new HttpParams().append('categoryId', id);
    return this.httpGet({
      url: this.baseUrl + '/BlogManagement/GetAllPublishedBlogs',
      params: params,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  getAllBlogComment(blogId: number): Observable<any> {
    const params = new HttpParams().append('blogId', blogId);
    return this.httpGet({
      url: this.baseUrl + '/BlogManagement/GetBlogComments',
      params: params,
      noLoadingMask: true,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  addComment(blogId: number, comment: string): Observable<any> {
    const data = { blogId, comment };
    return this.httpPost({
      url: this.baseUrl + '/BlogManagement/AddNewBlogComment',
      payload: data,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  updateComment(blogCommentId: number, comment: string): Observable<any> {
    const data = { blogCommentId, comment };
    return this.httpPost({
      url: this.baseUrl + '/BlogManagement/UpdateBlogComment',
      payload: data,
      callerErrorHandler: false,
    }) as Observable<any>;
  }

  deleteComment(blogCommentId: number): Observable<any> {
    const params = new HttpParams().append('blogCommentId', blogCommentId);
    return this.httpGet({
      url: this.baseUrl + '/BlogManagement/DeleteBlogComment',
      params: params,
      callerErrorHandler: false,
    }) as Observable<any>;
  }
}
