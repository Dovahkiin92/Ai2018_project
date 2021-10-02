import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { AuthenticationService } from '../_services/authentication.service';
import {AccountService} from "../_services/account.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService : AccountService,
    private location: Location,
    private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  openSnackBar(message: string) {
    return this.snackBar.open(message, 'Close', {
      duration: 2000,
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    alert('submit');
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      this.openSnackBar('Data not valid.');
      return;
    }
    this.loading = true;
    this.accountService.registerAccount(this.f.username.value, this.f.password.value);

  }

  goBack(): void {
    this.location.back();
  }
}
