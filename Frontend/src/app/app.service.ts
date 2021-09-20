import {Injectable} from '@angular/core';
import { Cookie } from 'ng2-cookies';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

export class Foo {
  constructor(
    public id: number,
    public name: string) { }
}

@Injectable()
export class AppService {
  public clientId = 'clientId';
  public redirectUri = 'http://localhost:8081/';

  constructor(
    private http: HttpClient){}

  retrieveToken(code): void{
    let params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', this.clientId);
    params.append('client_secret', 'secret');
    params.append('redirect_uri', this.redirectUri);
    params.append('code', code);

    let headers = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'});
    this.http.post('http://localhost:9000/oauth/token', params.toString(), {  headers })
      .subscribe(
        data => this.saveToken(data),
        err => alert('Invalid Credentials')
      );
  }

  saveToken(token): void{
    var expireDate = new Date().getTime() + (1000 * token.expires_in);
    Cookie.set('access_token', token.access_token, expireDate);
    Cookie.set('id_token', token.id_token, expireDate);
    console.log('Obtained Access token');
    window.location.href = 'http://localhost:8081';
  }

  getResource(resourceUrl): Observable<any>{
    let headers = new HttpHeaders(
      {'Content-type': 'application/x-www-form-urlencoded; charset=utf-8', 'Authorization': 'Bearer ' + Cookie.get('access_token')});
    return this.http.get(resourceUrl, {  headers })
    //  .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
      ;
  }

  checkCredentials(): boolean{
    return Cookie.check('access_token');
  }

  logout(): void {
    let token = Cookie.get('id_token');
    Cookie.delete('access_token');
    Cookie.delete('id_token');
 //   let logoutURL = "http://localhost:8083/auth/realms/baeldung/protocol/openid-connect/logout?id_token_hint="
   //   + token
    //  + "&post_logout_redirect_uri=" + this.redirectUri;

   // window.location.href = logoutURL;
  }
}
