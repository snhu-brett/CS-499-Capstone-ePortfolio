import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  public formError: string = '';
  public isSubmitting: boolean = false;
  submitted = false;

  credentials = {
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void { }

  public onLoginSubmit(): void {
    this.formError = '';
    this.submitted = true;

    if (!this.credentials.email || !this.credentials.password) {
      this.formError = 'Email and password are required.';
      return;
    }

    this.doLogin();
  }

  private doLogin(): void {
    const user = {
      name: '',
      email: this.credentials.email.trim()
    } as User;

    this.isSubmitting = true;

    this.authenticationService.login(user, this.credentials.password)
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['']);
        },
        error: (error: any) => {
          this.isSubmitting = false;
          this.formError = error?.error?.message || 'Login failed. Please try again.';
        }
      });
  }
}