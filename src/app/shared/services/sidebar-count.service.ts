import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarCountService {
  sidebarCount: BehaviorSubject<{
    unacknowledgedCount: number;
    unreadMessageCount: number;
  }> = new BehaviorSubject({ unacknowledgedCount: 0, unreadMessageCount: 0 });

  sidebarCount$ = this.sidebarCount.asObservable();
}
