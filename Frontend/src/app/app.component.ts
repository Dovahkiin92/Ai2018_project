
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
  render = true;
  constructor( private auth: AuthenticationService) { }
  ngOnInit(): void {
    const i = window.location.href.indexOf('code');
    if ( i > -1 && !this.logged ){
      this.render = false;
      // successful login and auth code in url
      this.auth.retrieveToken(window.location.href.substring(i + 5)).subscribe(
        data => {
          this.auth.setSession(data);
          this.logged = true;
          window.opener.location.href = 'http://localhost:4200';
          window.close();
          this.render = true;
        }
        ,
        err => alert('Invalid Credentials')
      );
    }
  }
}
