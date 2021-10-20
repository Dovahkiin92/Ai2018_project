import { Component, OnInit} from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Account } from '../_models/Account';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  account: Account;
  constructor(
    private accountService: AccountService,
    private snackBar: MatSnackBar
  ) {
   }

  ngOnInit(): void {
    this.accountService.account().subscribe(
      (data: any) => {
        this.account = new Account();
        this.account.id = data.id;
        this.account.username = data.username;
        this.account.wallet = data.wallet;
      },
      error => {
        console.log(error);
        this.snackBar.open('Server currently unavailable', 'Retry')
          .onAction().subscribe(() => {
          window.location.reload();
        });


      }
    );
  }
}
