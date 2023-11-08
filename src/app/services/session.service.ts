import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { take } from "rxjs/internal/operators/take";
import { UserLoginModel } from '../models/user-login.model';
import { TokenRefreshRequestModel } from '../models/token-refreshtoken.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  base_url = `${environment.url}`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(userLogin: UserLoginModel): Observable<any> {
    const headers = new HttpHeaders().set(
      'x-custom-key', environment.xCustomKey
    );
    return this.http
      .post<any>(`${this.base_url}api/auth/v1/login`, userLogin, { headers }).pipe(take(1));
  }

  sendEmailReset(body: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'x-custom-key', environment.xCustomKey
    );
    return this.http
      .post(`${this.base_url}sendemailreset`, body, { headers }).pipe(take(1));
  }

  refreshToken(tokenRefresh: TokenRefreshRequestModel) {
    const headers = new HttpHeaders().set('x-custom-key', environment.xCustomKey);
    return this.http
        .post<any>(`${this.base_url}api/auth/v1/refresh-token`, tokenRefresh, { headers });
  }

  signOut() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  registerTokenRefreshToken(tokenRefreshToken: TokenRefreshRequestModel) {
    localStorage.setItem('token', tokenRefreshToken.token);
    localStorage.setItem('refreshToken', tokenRefreshToken.refreshToken);
  }

  isAuthenticated() {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    return token && refreshToken;
  }

  resetPassword(user: any) : Observable<any>{
    const headers = new HttpHeaders().set(
        'x-custom-key', environment.xCustomKey
    );
    return this.http
        .post<any>(`${this.base_url}resetpassword`, user, { headers }).pipe(take(1));
}
}
