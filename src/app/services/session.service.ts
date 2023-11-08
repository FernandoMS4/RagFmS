import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { take } from "rxjs/internal/operators/take";

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  base_url = `${environment.url}`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(body: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'x-custom-key', environment.xCustomKey
    );
    return this.http
      .post<any>(`${this.base_url}api/auth/v1/login`, body, { headers }).pipe(take(1));
  }

  sendEmailReset(body: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'x-custom-key', environment.xCustomKey
    );
    return this.http
      .post(`${this.base_url}sendemailreset`, body, { headers }).pipe(take(1));
  }

  refreshToken(refresh_token: string, token: string) {
    const headers = new HttpHeaders().set('x-custom-key', environment.xCustomKey);
    const rt = { RefreshToken: refresh_token, token: token }
    return this.http
        .post<any>(`${this.base_url}api/auth/v1/refresh-token`, rt, { headers });
  }

  signOut() {
    localStorage.clear();
    this.router.navigate(['/login']);
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
