import {Injectable} from '@angular/core';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import {HttpClient} from '@angular/common/http';
import {JWT} from '../_models/JWT';
import {stringify} from "@angular/compiler/src/util";
import {environment} from "../../environments/environment";
import {Account} from "../_models/Account";

@Injectable()
export class AuthenticationService {
  private username;
  public clientId = 'clientId';
  public redirectUri = 'http://localhost:4200';

  constructor(
    private http: HttpClient) {
  }

  // retrieve auth code
  login(): void {
    // window.location.href = 'http://localhost:8081/oauth/authorize?response_type=code&client_id='
    window.location.href = 'http://192.168.99.103:9000/oauth/authorize?response_type=code&client_id='
      + this.clientId + '&redirect_uri='
      + this.redirectUri;
  }

  retrieveToken(code): void {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('Authorization', 'Basic ' + btoa(this.clientId + ':secret'));
    params.append('client_id', this.clientId);
    params.append('client_secret', 'secret');
    params.append('redirect_uri', this.redirectUri);
    params.append('response_type', 'token');

    const headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; ,charset=utf-8 ',
      'Authorization': 'Basic ' + btoa(this.clientId + ':secret')
    });
    // this.http.post('http://localhost:9000/oauth/token?code=' + code, params.toString(), {  headers })
    this.http.post<JWT>('http://192.168.99.103:9000/oauth/token?code=' + code, params.toString(), {headers})
      .subscribe(
        data => this.setSession(data),
        err => alert('Invalid Credentials')
      );
  }

  private setSession(token): void {
    const expiresAt = moment().add(token.expires_in, 'second');
    localStorage.setItem('id_token', token.access_token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    console.log('Obtained Access token' + token);
  }

  /*
  saveToken(token): void{
    let expireDate = new Date().getTime() + (1000 * token.expires_in);
    Cookie.set('access_token', token.access_token, expireDate);
    Cookie.set('id_token', token.id_token, expireDate);
    console.log('Obtained Access token');
    window.location.href = 'http://localhost:4200';
  }
*/
  getResource(resourceUrl): Observable<any> {
    const headers = new HttpHeaders(
      {
        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Authorization': 'Bearer ' + localStorage.get('id_token')
      });
    return this.http.get(resourceUrl, {headers})
      //  .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
      ;
  }

  public getExpirationTime(): any {
    const expiration = localStorage.getItem('expires_at');
    if (expiration === null) {
      return null;
    }
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  public isAuthenticated(): boolean {
    if (localStorage.getItem('id_token') === null) {
      return false;
    }
    return moment().isBefore(this.getExpirationTime());
  }

  logout(): void {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  getToken(): any {
    return localStorage.getItem('id_token');
  }
  getRegistrationToken(): any {
    return localStorage.getItem('registration_token');
  }

  retrieveRegistrationToken() {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', 'register-app');
    console.log(params.toString());

    const headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; ,charset=utf-8 ',
      'Authorization': 'Basic ' + btoa('register-app:secret')
    });

    return this.http.post<JWT>('http://192.168.99.103:9000/oauth/token', params.toString(), {headers});
  }

  setRegistrationSession(data) {
    const expiresAt = new Date(data.expires_in);
    localStorage.setItem('registration_token', data.access_token);
    localStorage.setItem('expires_at', expiresAt.toString());
    console.log('Obtained Access token' + data);
  }


  register(account) {
    this.retrieveRegistrationToken().subscribe(
      data => {
        this.setRegistrationSession(data);

        this.http.post<Account>(environment.api_url + '/register', account)
          .subscribe((res: any) => {
            if (res && res.id) {
              console.log('Successfully registered with id: ' + res.id);
              this.login();
            } else {
              console.log('Failed to register.');
              console.log(res);
            }
          });
      },
      () => alert('Invalid Credentials')
    );
    // Submit registration using obtained token
  }
}





/*
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
// import { JWT } from '../_models/JWT';
import {Account} from './_models/Account';
// import * as moment from 'moment';

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient) { }

  register(token: string, username: string, password: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + token
      })
    };
    // Submit registration using obtained token
    const user = new Account();
    user.username = username;
    user.password = password;

    return this.http.post<Account>(environment.api_url + '/register', user, httpOptions)
      .pipe(map( (res: User ) => {
        if (res && res.id) {
          console.log('Successfully registered with id: ' + res.id);
        } else {
          console.log('Failed to register.');
          console.log(res);
        }
      }));
  }

  login(username: string, password: string) {
    const httpParams = new HttpParams()
      .set('grant_type', 'password')
      .set('username', username)
      .set('password', password);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Authorization': 'Basic ' + btoa('trusted-app:secret')
      })
    };

    return this.http.post<JWT>(environment.trusted_url, httpParams.toString(), httpOptions)
      .pipe(map((res: JWT) => {
        // login successful if there's a jwt token in the responsee
        if (res && res.access_token) {
          console.log('GOT USER token: ' + res.access_token);
          // store username and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify({
            username: username,
            token: res.access_token,
            expires_in: res.expires_in,
            refresh_token: res.refresh_token,
            expiry: moment().add(res.expires_in, 'seconds') // When will this token be not valid anymore?
          }));
          this.setExpiryTimeout(); // Set a timer for logging out before token expires
        } else {
          console.log('Error logging in');
          console.log(res);
        }
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }

  refresh() {
    // The flow for refresh token  supposes the use of app's client credentials for endpoint authentications (Basic auth)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Authorization': 'Basic ' + btoa(environment.client_credentials)
      })
    };
    // In order to get a new access token, we send a form-data request with 'refresh_token' grant type
    // and the refresh token as body
    const httpParams = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', this.getRefreshToken());

    return this.http.post<JWT>(environment.trusted_url, httpParams.toString(), httpOptions)
      .pipe(map((res: JWT) => {
        // login successful if there's a jwt token in the responsee
        if (res && res.access_token) {
          console.log('GOT USER token: ' + res.access_token);
          // store username and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify({
            username: this.getLoginUsername(),
            token: res.access_token,
            expires_in: res.expires_in,
            refresh_token: res.refresh_token,
            // Used to set a timer in app.component.ts for token refresh
            expiry: moment().add(res.expires_in, 'seconds') // When will this token be not valid anymore?
          }));
        } else {
          console.log('Error logging in');
          console.log(res);
        }
      }));
  }

  checkLogin(): void {
    this.http.get<User>(environment.user_url, {}).subscribe(
      (res) => {
        // User is logged in, no issues
        console.log('login is valid', res);
      },
      (err) => {
        // If we get 401 error, login is not valid anymore: logout the user.
        console.log('login is invalid', err);
        if ( err.status === 401) {
          this.logout();
        }
      }
    );
  }

  setExpiryTimeout(): void {
    const expiry = this.getLoginExpiry();
    const ms_until_expiry = moment().diff(expiry);
    console.log('Login token expires in (ms) ', -1 * ms_until_expiry);
    if (ms_until_expiry < 0 ) {
      setTimeout(() => {
        console.log('Login token expired');
        this.logout();
      }, -1 * ms_until_expiry);
    } else {
      this.logout();
    }
  }

  /!*
  * Utility methods (for getting logged-in user parameters)
  * *!/
  isLogin() {
    return localStorage.getItem('currentUser') != null;
  }

  getLoginToken() {
    const cur = JSON.parse(localStorage.getItem('currentUser'));
    if (cur && cur.token) {
      return cur.token;
    }
    return null;
  }

  getRefreshToken() {
    const cur = JSON.parse(localStorage.getItem('currentUser'));
    if (cur && cur.token) {
      return cur.refresh_token;
    }
    return null;
  }

  getLoginExpiry() {
    const cur = JSON.parse(localStorage.getItem('currentUser'));
    if (cur && cur.expiry) {
      return cur.expiry;
    }
    return null;
  }

  getLoginUsername() {
    const cur = JSON.parse(localStorage.getItem('currentUser'));
    if (cur && cur.username) {
      return cur.username;
    }
    return null;
  }

  getRegisterToken() {
    const httpParams = new HttpParams()
      .set('grant_type', 'client_credentials');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Authorization': 'Basic ' + btoa('register-app:secret')
      })
    };

    return this.http.post<JWT>(environment.register_url, httpParams.toString(), httpOptions)
      .pipe(map((tok: JWT) => {
        // login successful if there's a jwt token in the response
        if (tok && tok.access_token) {
          console.log('GOT REGISTRATION token: ' + tok.access_token);
          localStorage.setItem('registerToken', tok.access_token);
        } else {
          console.log('error getting token');
          console.log(tok);
        }
      }));
  }
*/
