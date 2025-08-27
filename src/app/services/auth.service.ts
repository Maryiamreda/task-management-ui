import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  isAuthenticated$;

  constructor() {
    const hasToken = typeof localStorage !== 'undefined' && !!localStorage.getItem('jwt');
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(hasToken);
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  setAuthenticated(value: boolean) {
    this.isAuthenticatedSubject.next(value);
  }
}
