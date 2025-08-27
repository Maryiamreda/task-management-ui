import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private authUrl = 'http://localhost:8080/users/me/tasks/check-auth';
  public authState = new BehaviorSubject<{ auth: boolean }>({
    auth: false,
  });
constructor(private http: HttpClient) {}
  checkAuth(): Observable<boolean> {
    return this.http.get<boolean>(this.authUrl);
  }
  setAuth(value: boolean) {
    this.authState.next({ auth: value });
  }

  get isAuthenticated() {
    return this.authState.asObservable();
  }
  
}
