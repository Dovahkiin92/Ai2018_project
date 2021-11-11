import {Injectable} from '@angular/core';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import {HttpClient} from '@angular/common/http';
import {JWT} from '../_models/JWT';
import {environment} from "../../environments/environment";
import {Account} from "../_models/Account";

@Injectable()
export class AuthenticationService {
  public clientId = environment.CLIENT_ID;
  public redirectUri = environment.REDIRECT;
  public auth = false;
  constructor(
    private http: HttpClient) {
  }

  // retrieve auth code, popup mode
  login(): void {
    this.auth= true;
    window.open(environment.authorization_code_url +'?response_type=code&client_id='+ this.clientId
      + '&redirect_uri=' + this.redirectUri
      ,'popup',
      'width=450,height=500,status=yes,location = off');
  }
/* get access token from auth serv*/
  retrieveToken(code): Observable<any> {
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
    return this.http.post<JWT>(environment.access_token_url + '?code=' + code, params.toString(), {headers});
  }

   setSession(token): void {
    const expiresAt = moment().add(token.expires_in, 'second');
    localStorage.setItem('id_token', token.access_token);
    localStorage.setItem('refresh_token',token.refresh_token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));

     console.log('Obtained Access token' + token);
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
    // no token
    return (this.getToken() !== null)
  }



  logout(): void {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('refresh_token');
    console.log('logout');
    window.location.href =  environment.logout_url;
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
    const headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; ,charset=utf-8 ',
      'Authorization': 'Basic ' + btoa('register-app:secret')
    });
    return this.http.post<JWT>(environment.access_token_url, params.toString(), {headers});
  }

  setRegistrationSession(data) {
    const expiresAt = new Date(data.expires_in);
    localStorage.setItem('registration_token', data.access_token);
    localStorage.setItem('registration_expires_at', expiresAt.toString());
    console.log('Obtained Access token' + data);
  }
  clearRegistrationSession(){
    localStorage.removeItem('registration_token');
    localStorage.removeItem('registration_expires_at');  }

  register(account){
    this.retrieveRegistrationToken().subscribe(
      data => {
        // continue to register user to resource server
        this.setRegistrationSession(data);
        this.http.post<Account>(environment.register_url, account)
          .subscribe((res: any) => {
              if (res && res.id) {
                console.log('Successfully registered with id: ' + res.id);
                this.clearRegistrationSession();
                this.login();
              } else {
                console.log('Failed to register.');
                console.log(res);
              }},
            () =>{
              alert('Failed to register.');
              this.clearRegistrationSession();
            });
      }
      ,() => {
        alert('Authorization failed');
        this.clearRegistrationSession();
      });
  }
  checkExpireTime(){
    return moment().isAfter(this.getExpirationTime());

  }
  getRefreshToken(){
    return localStorage.getItem('refresh_token');
  }
  refresh() {
    // The flow for refresh token  supposes the use of app's client credentials for endpoint authentications (Basic auth)
    // In order to get a new access token, we send a form-data request with 'refresh_token' grant type
    // and the refresh token as body
    const httpParams = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', this.getRefreshToken());
    localStorage.removeItem('id_token');
    const headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; ,charset=utf-8 ',
      'Authorization': 'Basic ' + btoa(this.clientId + ':secret')
    });
    return this.http.post<JWT>(environment.access_token_url, httpParams.toString(), {headers})
      .subscribe((res: JWT) => {
        // login successful if there's a jwt token in the response
        if (res && res.access_token) {
         this.setSession(res)
        } else {
          console.log('Error logging in');
          localStorage.removeItem('refresh_token');
        window.location.href = this.redirectUri;
        }
      });
  }
}
