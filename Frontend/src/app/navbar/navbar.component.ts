
import {Component, Input, OnInit} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {MenuItem} from './menu-item';
import {AuthenticationService} from '../_services/authentication.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() isLoggedIn: boolean;


  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar
  ) {
  }
  menuItems: MenuItem[] = [
      {
      label: '',
      icon: 'person_add',
      link: '/register',
      login: false
    },
    {
      label: '',
      icon: 'person',
      link: '/login',
      login: false
    },
    {
      label: 'User',
      icon: 'account_circle',
      link: '/account',
      login: true
    },
   /* {
      label: 'Archivi',
      icon: 'archive',
      link: '/archives',
      login: true
    },*/ {
      label: 'Cart',
      icon: 'receipt',
      link: '/store',
      login: true
    },
    {
      label: 'Shop',
      icon: 'map',
      link: '/purchase',
      login: true
    },
    {
      label: 'Logout',
      icon: 'exit_to_app',
      link: '/login',
      login: true
    },
  ];

  ngOnInit(): void {
    if ( this.authenticationService.isAuthenticated() ){
      this.isLoggedIn = true;
    }
    this.router.events
      .subscribe(e => {
        if (e instanceof NavigationStart){
          if (this.isLoggedIn && !this.authenticationService.getToken() && !e.url.includes('code')){
            this.snackBar.open('Server unavailable. Retry later', 'Close', {duration: 1400});
          }
        }});
  }
  getMenuItems(): MenuItem[] {
    // tslint:disable-next-line:max-line-length
    return this.menuItems.filter((item: MenuItem) => item.login === null || item.login === false && !this.isLoggedIn || item.login === true && this.isLoggedIn );
  }

}
