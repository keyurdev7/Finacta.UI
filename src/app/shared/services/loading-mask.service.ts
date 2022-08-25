import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingMaskService {
  maskSubject = new BehaviorSubject(false);
  message: string = '';
  maskCallCount = 0;

  constructor() {}

  subscribe(observer: any): Subscription {
    return this.maskSubject.subscribe(observer);
  }

  mask(message: string = ''): void {
    this.message = message;
    if (this.maskCallCount <= 0) {
      this.maskSubject.next(true);
    }
    this.maskCallCount++;
  }

  unmask(): void {
    this.maskCallCount--;
    if (this.maskCallCount <= 0) {
      this.maskSubject.next(false);
      this.maskCallCount = 0;
    }
  }
}
