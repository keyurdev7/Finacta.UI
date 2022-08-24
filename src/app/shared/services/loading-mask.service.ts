import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable()
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

    // We track how many times the loading mask has been called
    // so we know when to hide it when handling concurrent calls
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
