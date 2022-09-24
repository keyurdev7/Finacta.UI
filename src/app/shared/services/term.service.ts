import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AbstractService } from "./abstract.service";
import { LoadingMaskService } from "./loading-mask.service";
import { Observable } from 'rxjs';
import { AddEditTermForm } from "src/app/models/add-edit-term";

@Injectable({
    providedIn: 'root',
  })
 export class TermService extends AbstractService{
    readonly baseUrl: string = environment.application_host + '/api';

    constructor(httpClient: HttpClient, loadingMaskService: LoadingMaskService) {
        super(httpClient, loadingMaskService);
      }

      getAllTerms(): Observable<any> {
        return this.httpGet({
          url: this.baseUrl + '/TermManagement/GetAllTerms',
          params: new HttpParams(),
          callerErrorHandler: false,
        }) as Observable<any>;
      }

      addTerm(data: AddEditTermForm): Observable<any> {
        const body = new FormData();
        Object.keys(data).forEach((key) => {
          body.append(key, data[key]);
        });
        return this.httpPost({
          url: this.baseUrl + '/TermManagement/AddNewTerm',
          payload: body,
          callerErrorHandler: false,
        }) as Observable<any>;
      }

      updateTerm(data: AddEditTermForm): Observable<any> {
        const body = new FormData();
        Object.keys(data).forEach((key) => {
          body.append(key, data[key]);
        });
        return this.httpPost({
          url: this.baseUrl + '/TermManagement/UpdateTerm',
          payload: body,
          callerErrorHandler: false,
        }) as Observable<any>;
      }

      deleteTerm(termid: number): Observable<any> {
        const params = new HttpParams().append('termId', termid);
        return this.httpGet({
          url: this.baseUrl + '/TermManagement/DeleteTerm',
          params: params,
          callerErrorHandler: false,
        }) as Observable<any>;
      }
 } 