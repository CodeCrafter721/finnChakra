import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpinnerService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private requestCount = 0;
  private debounceTimer: any;

  show(): void {
    this.requestCount++;
    clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {
      if (this.requestCount > 0) {
        this.loadingSubject.next(true);
      }
    }, 300);
  }

  hide(): void {
    this.requestCount = Math.max(0, this.requestCount - 1);
    if (this.requestCount === 0) {
      clearTimeout(this.debounceTimer);
      this.loadingSubject.next(false);
    }
  }
}
