import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-home',
  providers: [AuthenticationService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public isLoggedIn = false;

  constructor(
    private router: Router,
    private auth: AuthenticationService
  ) {
  }

  ngOnInit(): void {}
}
