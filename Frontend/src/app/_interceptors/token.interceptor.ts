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
     if (curToken) {
        // console.log('Appending authenticated user\'s token!');
        request = request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + curToken
          }
        });
        console.log('ADDED' + curToken); /// DEBUG
      }
     return next.handle(request);
  }
}
