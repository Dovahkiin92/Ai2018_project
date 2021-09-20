
import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './_services/authentication.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Lab';
  logged = false;
  constructor( private auth: AuthenticationService) { }
  ngOnInit(): void {
    const i = window.location.href.indexOf('code');
    if ( i > -1 ){
      // successful login and auth code in url
      this.auth.retrieveToken(window.location.href.substring(i + 5));
      this.logged = true;
    }
  }
}
