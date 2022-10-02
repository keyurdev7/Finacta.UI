import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class StripeDemoService {
  constructor(private http: HttpClient) {}
  createCustomer(data) {
    return this.http.post('http://localhost:4242/create-customer', data);
  }
  StartSubscription(data) {
    return this.http.post('http://localhost:4242/create-subscription', data);
  }
}
