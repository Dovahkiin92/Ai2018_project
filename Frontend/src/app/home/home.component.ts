import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
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
  onClick(){
    if( this.auth.isAuthenticated()){
      this.router.navigate(['/purchase']);
    } else{
      this.router.navigate(['/register']);
    }
  }
}
