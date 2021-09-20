import { Component, OnInit} from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Account } from '../_models/Account';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  account: Account;
  constructor(
    private accountService: AccountService,
  ) {}

  ngOnInit(): void {
    this.accountService.account().subscribe(
      (data: any) => {
        this.account = new Account();
        this.account.id = data.id;
        this.account.username = data.username;
        this.account.wallet = data.wallet;
        this.account.roles = data.roles;
      },
      error => {
        console.log(error);
      }
    );
  }
}
