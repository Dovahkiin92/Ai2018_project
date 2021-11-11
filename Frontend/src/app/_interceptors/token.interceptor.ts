import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private auth: AuthenticationService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
     const curToken = this.auth.getToken();
     if ( curToken ) {
       if(this.auth.checkExpireTime()){
         this.auth.refresh();
       }
        request = request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + curToken
          }
        });
      } else {
       // check if it is a registration request
       const register = this.auth.getRegistrationToken();
       if (register) {
         request = request.clone({
           setHeaders: {
             Authorization: 'Bearer ' + register
           }
         });
       }
     }
    return next.handle(request);
  }
}
