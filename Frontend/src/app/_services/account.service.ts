import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Account } from '../_models/Account';
import {Observable} from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AccountService {
  constructor(private auth: AuthenticationService, private http: HttpClient) {}

  account(): Observable<any>{
    return this.http.get(environment.GET_ACCOUNT_URL);
  }
  registerAccount(username, password){
    const account = new Account();
    account.username = username;
    account.password = password;
    this.auth.register(account);
  }
}
