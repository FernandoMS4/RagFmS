import { HTTP_INTERCEPTORS, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { SessionService } from './services/session.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
// const TOKEN_HEADER_KEY = 'Authorization';  // for Spring Boot back-end
const TOKEN_HEADER_KEY = 'authorization';    // for Node.js Express back-end
@Injectable()
export class HttpsRequestInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  roleList: any[] = new Array<any>();
  resource: any[] = new Array<any>();
  permission: any[] = [];

  constructor(
    private sessionService: SessionService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
    let authReq = req;
    const token = localStorage.getItem("token");
    if (token != null) {
      authReq = this.addTokenHeader(req, token);
    }
    return next.handle(authReq).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && authReq.url.includes('refresh') && error.status === 401) {
        this.sessionService.signOut();
        return throwError(error);
      } if (error instanceof HttpErrorResponse && !authReq.url.includes('login') && error.status === 401) {
        return this.handle401Error(authReq, next);
      }
      return throwError(error);
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const refreshToken = localStorage.getItem("refreshToken");
      const email = JSON.parse(localStorage.getItem("user")!).email;
      if (refreshToken && email) {
        return this.sessionService.refreshToken(refreshToken, email).pipe(
          switchMap((result: any) => {
            this.isRefreshing = false;
            const token = result.token;
            localStorage.setItem("token", token);
            localStorage.setItem("refreshToken", result.refreshToken);
            this.refreshTokenSubject.next(token);
            console.log("TOKEN REFRESHED .........")
            return next.handle(this.addTokenHeader(request, token));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.sessionService.signOut();
            return throwError(err);
          })
        );
      }
      else {
          this.isRefreshing = false;
          this.sessionService.signOut();
      }
    }
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }
  
  private addTokenHeader(request: HttpRequest<any>, token: string) {
    /* for Spring Boot back-end */
    // return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
    /* for Node.js Express back-end */
    return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
  }

  verifyPermission(){
    for (let x = 0; x < this.roleList.length; x++) {
      for (let i = 0; i < this.roleList[x].resourceClaimViews.length; i++) {
        const e = this.roleList[x].resourceClaimViews[i];
        const exist = this.permission.findIndex(x => x.internalCode === e.internalCode);
        if(exist !== -1){
          if(this.permission[exist].roleResourceAccessLevel < e.roleResourceAccessLevel){
            this.permission[exist].roleResourceAccessLevel = e.roleResourceAccessLevel;
            this.permission[exist].actions = e.actions;
          }
        } else {
          const permission = {
            internalCode: e.internalCode,
            roleResourceAccessLevel: e.roleResourceAccessLevel,
            actions: e.actions,
          };
          this.permission.push(permission);
        }
      }
    }
    localStorage.setItem('permission', JSON.stringify(this.permission));
  }

  verifyCanSeeScreen(screen: string){
    return this.permission.find(e => e.internalCode == screen);
  }
}
@NgModule({
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: HttpsRequestInterceptor,
        multi: true,
    }]
})
export class Interceptor { }
