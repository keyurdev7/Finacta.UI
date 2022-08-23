import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'https://finactaapp.azurewebsites.net/api';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/Auth/Register`, data);
  }
}
