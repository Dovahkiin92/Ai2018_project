import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthenticationService, private router: Router) {
  }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.auth.logout();
      window.location.href = 'http://localhost:4200';
    } else {
       this.auth.login();
      // this.router.navigateByUrl('/account');
    }
  }
}
